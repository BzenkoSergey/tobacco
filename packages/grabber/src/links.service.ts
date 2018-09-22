const cheerio = require('cheerio');

import { Subject, merge } from 'rxjs';

import { HttpStack } from './http/http-stack';

export class LinksService {
	private httpStack: HttpStack;
	private links: string[] = [];
	private proccessed: string[] = [];

	constructor(
		private limit: number,
		private host: string,
		private path: string,
		private protocol: string
	) {
		this.httpStack = new HttpStack(this.host, false);
		this.addLinks([this.host + this.path]);
	}

	perform(subj?: Subject<[string, string, string[]]>) {
		if(!subj) {
			subj = new Subject<[string, string, string[]]>();
		}

		this.getStreams()
			.subscribe(
				d => {
					const url = d[0];
					const html = d[1];
					const links = d[2];

					const uniqueLinks = this.uniqueLinks(links);
					this.addLinks(uniqueLinks);

					subj.next([url, html, links]);
				},
				err => subj.error(err),
				() => {
					if(this.links.length) {
						this.perform(subj);
					} else {
						subj.complete();
					}
				}
			);

		return subj;
	}

	private addLinks(links: string[]) {
		if(!this.limit) {
			this.links = this.links.concat(links);
			return;
		}
		const linksAdded = this.links.length + this.proccessed.length;
		const canAdd = Math.abs(linksAdded - this.limit);
		const toAdd = links.slice(0, canAdd);
		this.links = this.links.concat(toAdd);
	}

	private getStreams() {
		const links = this.links.concat([]);
		const subjs = links.map(l => this.getStream());
		return merge(...subjs)
	}

	private getStream() {
		const url = this.genRequestUrl();
		return this.performHttp(url);
	}

	private uniqueLinks(links: string[]): string[] {
		const uniques = new Set(links);
		return Array.from(uniques)
			.filter(l => {
				return !this.proccessed.includes(l);
			})
			.filter(l => {
				return !this.links.includes(l);
			});
	}

	private performHttp(url: string) {
		let subj = new Subject<[string, string, string[]]>();

		this.proccessed.push(url);
		const i = this.links.indexOf(url);
		this.links.splice(i, 1);

		let html = '';
		this.httpStack.get(
			url, 
			(data: string) => {
				html += data.toString();
			},
			headers => {
				subj.next([url, html, this.parse(html)]);
				subj.complete();
			},
			(error: any) => {
				console.log('error:' + url);
				subj.error(error);
			},
			this.protocol);

		return subj;
	}

	private parse(html: string): string[] {
		const $ = cheerio.load(html);
		const $roots = $('a');

		if(!$roots.toArray().length) {
			console.log('EMPTY ');
		}

		return $roots.toArray()
			.map((root: JQuery<HTMLElement>) => {
				const $root = $(root);
				return $root.attr('href');
			})
			.filter(href => {
				return !!href;
			})
			.map((href: string) => {
				return href.trim();
			})
			.filter(href => {
				return !!href;
			})
			.filter(href => {
				return href !== '/';
			})
			.filter((href: string) => {
				return !~href.indexOf('javascript:void(0)');
			})
			.filter((href: string) => {
				return !~href.indexOf('mailto:');
			})
			.filter((href: string) => {
				return !~href.indexOf('tel:');
			})
			.filter((href: string) => {
				if(!~href.indexOf(this.host) && !!~href.indexOf('http')) {
					return false
				}
				return true;
			})
			.map(href => {
				if(!~href.indexOf(this.host)) {
					if(href[0] !== '/') {
						return this.host + '/' + href;
					}
					return this.host + href;
				}
				return href;
			});
	}

	private genRequestUrl() {
		return this.links[0];
	}
}