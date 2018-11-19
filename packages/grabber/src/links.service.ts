const cheerio = require('cheerio');

import { Subject, merge } from 'rxjs';

import { HttpStack } from './http/http-stack';

import { CacheService } from './cache/cache.service';

export class LinksService {
	private cacheService = new CacheService();
	private httpStack: HttpStack;
	private proccessed: string[] = [];
	private waiting: string[] = [];

	constructor(
		private limit: number,
		private host: string,
		private path: string,
		private protocol: string,
		private ignoreLinks: string[],
		private links: string[] = [],
		private onlyDefinedLinks = false,
		private testMode = false
	) {
		this.httpStack = new HttpStack(this.host, false);
		if (!this.onlyDefinedLinks) {
			this.addLinks([this.host + this.path]);
		}
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

					if (!this.onlyDefinedLinks) {
						const uniqueLinks = this.uniqueLinks(links);
						this.addLinks(this.getAllowed(uniqueLinks));
					}

					subj.next([url, html, links]);
				},
				err => subj.error(err),
				() => {
					if(this.links.length) {
						this.perform(subj);
					}

					if(!this.links.length && !this.waiting.length) {
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
		return this.fetch(url);
	}

	private getAllowed(links: string[]): string[] {
		return links.filter(link => {
			return !this.ignoreLinks.some(i => {
				return !!link.match(new RegExp(i, 'i'));
			});
		});
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

	private fetch(url: string) {
		if (this.testMode) {
			return this.fetchChange(url);
		}
		return this.performHttp(url);
	}

	private fetchChange(url: string) {
		let subj = new Subject<[string, string, string[]]>();
		this.waiting.push(url);
		this.proccessed.push(url);
		const i = this.links.indexOf(url);
		this.links.splice(i, 1);

		this.cacheService.fetch(url)
			.subscribe(
				html => {
					const i = this.waiting.indexOf(url);
					this.waiting.splice(i, 1);

					subj.next([url, html, this.parse(html)]);
					subj.complete();
				},
				e => {
					subj.error(e);
				}
			);
		return subj;
	}

	private performHttp(url: string) {
		let subj = new Subject<[string, string, string[]]>();

		this.waiting.push(url);
		this.proccessed.push(url);
		const i = this.links.indexOf(url);
		this.links.splice(i, 1);

		let html = '';
		this.httpStack.get(
			url, 
			(data: string) => {
				html += data.toString();
			},
			() => {
				const i = this.waiting.indexOf(url);
				this.waiting.splice(i, 1);

				this.cacheService.createFile(url, html)
					.subscribe(
						() => {},
						err => subj.error(err),
						() => {
							subj.next([url, html, this.parse(html)]);
							subj.complete();
						}
					)
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