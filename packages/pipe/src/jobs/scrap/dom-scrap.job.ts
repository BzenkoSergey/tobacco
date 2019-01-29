const cheerio = require('cheerio');
import { GrabberTransform } from './transforms/transform.enum';
import { TransformsService } from './transforms/transforms.service';
import { async } from './../../async';
import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from '../../core/di';
import * as URL from 'URL';
import { Session } from './../../core/session.service';

export class DomScrapJob implements Job {
	private options: any;
	staticOptions: any;
	schemeId: string;
	private di: DI;
	private pipePath: string;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
	}

	setDI(di: DI) {
		this.di = di;
		return this;
	}

	setPipePath(path: string) {
		this.pipePath = path;
		return this;
	}

	setSchemeId(schemeId: string) {
		this.schemeId = schemeId;
		return this;
	}

	setStaticOptions(options: string) {
		this.staticOptions = JSON.parse(options);
		return this;
	}

	run(dom: any) {
		let res;

		try {
			const d = cheerio.load(dom.dom || dom.html).root().find('html');
			// console.log('START');
			res = this.parse(d, this.options, dom.url);
			// console.log('END');
		} catch(e) {
			console.error(e);
		}
		// console.log(res);
		// const res = this.parse(dom, this.staticOptions);

		return async({
			url: dom.url,
			data: res
		});
	}

	destroy() {
		return this;
	}

	private getSession() {
		const session = this.di.get<Session>(this.pipePath, DIService.SESSION);
		return session.get();
	}

	private parse(dom: any, config: any, url: string, index?: number) {
		if (typeof config === 'string') {
			return config;
		}
		if (typeof config === 'number') {
			return config;
		}
		
		if (config.$ && config.$.selector === '$url') {
			return this.runTransforms(url, config.$.transforms);
		}
		if (config.$ && config.$.selector === '$scheme') {
			return this.schemeId;
		}
		if (config.$ && config.$.selector === '$session') {
			return this.getSession();
		}
		if (config.$ && config.$.selector === '$date') {
			return this.runTransforms(Date.now().toString(), config.$.transforms);
		}
		if (config.$ && config.$.selector === '$index') {
			return this.runTransforms((index || 0).toString(), config.$.transforms);
		}
		if (config.$ && config.$.selector === '$tagName') {
			if (dom.length > 1) {
				return dom.toArray()
					.map(f => this.runTransforms(cheerio(f).get(0).tagName, config.$.transforms))
					.filter(i => i !== null);
			} else {
				return this.runTransforms(dom.get(0).tagName, config.$.transforms);
			}
		}

		// console.log(dom);
		if (Array.isArray(config)) {
			let items = [];
			config.forEach(c => {
				items = items.concat(this.parse(dom, c, url, index));
			});
			return items.filter(i => i !== null);
		}
		if(!config.$ || !config.$.type) {
			let segment = dom;
			if (config.$ && config.$.selector && !dom.is(config.$.selector)) {
				segment = this.find(dom, config.$.selector);
			}
			if (segment.length > 1) {
				return segment.toArray()
					.map((f, i) => {
						const $el = cheerio(f);
						const obj = {};
						Object.keys(config)
							.forEach(prop => {
								if (prop === '$') {
									return;
								}
								obj[prop] = this.parse($el, config[prop], url, i);
							});
						return obj;
					})
					.filter(i => i !== null);
			}
			if (!segment.length) {
				return null;
			}
			const obj = {};
			Object.keys(config)
				.forEach(prop => {
					if (prop === '$') {
						return;
					}
					obj[prop] = this.parse(segment, config[prop], url, index);
				});
			return obj;
		}
	
		const $el = config.$.selector ? this.find(dom, config.$.selector) : dom;

		if (config.$.type === 'ATTR') {
			if ($el.length > 1) {
				return $el.toArray()
					.map((f, i) => this.runTransforms(this.checkValue(cheerio(f).attr(config.$.resource), config.$.selector, url, i), config.$.transforms))
					.filter(i => i !== null);
			}
			return this.runTransforms(this.checkValue($el.attr(config.$.resource), config.$.selector, url, index), config.$.transforms);
		}

		if ($el.length > 1) {
			return $el.toArray()
				.map((f, i) => {
					if (config.$.contentType === 'HTML') {
						// debugger;
					}
					let text = '';
					if (config.$.type === 'PROP') {
						text = cheerio(f).get(0).tagName;
					} else {
						text = config.$.contentType !== 'HTML' ? cheerio(f).text() : cheerio(f).html();
					}
					return this.runTransforms(this.checkValue(text, config.$.selector, url, i), config.$.transforms);
				})
				.filter(i => i !== null);
		}
		if (config.$.contentType === 'HTML') {
			// debugger;
		}
		let text = '';
		if (config.$.type === 'PROP') {
			text = $el.get(0).tagName;
		} else {
			text = config.$.contentType !== 'HTML' ? $el.text() : $el.html();
		}
		return this.runTransforms(this.checkValue(text, config.$.selector, url, index), config.$.transforms);
	}

	private checkValue(value: string, selector: string, url: string, index?: number) {
		selector = selector || "";
		if (!value || !(value.trim())) {
			return value;
		}
		const adds = selector.split('&&');
		if (adds.length === 1) {
			return value;
		}
		const vars = adds[1].split(',');
		vars.forEach(v => {
			if (!!~v.indexOf('$lastUriPath')) {
				const info = URL.parse(url);
				const h = info.path.lastIndexOf('/');
				const uri = info.path.substr(h).trim();
				//if (uri && uri !=='/' && uri !== '/index.php') {
					const f = v.replace('$lastUriPath', uri);
					value = value + f;
				//}
			}
			if (!!~v.indexOf('$query')) {
				const info = URL.parse(url);
				const uri = info.search;
				const f = v.replace('$query', uri);
				value = value + f;
			}
			if (!!~v.indexOf('$date')) {
				const f = v.replace('$query', Date.now().toString());
				value = value + Date.now();
			}
		});
		return value;
	}

	private runTransforms(value: any, transforms: any) {
		if (!transforms) {
			return value;
		}
		const transformsService = new TransformsService();
		transforms.forEach(transform => {
			const name = transform.name;
			const option = transform.option;
			value = transformsService.perform(value, name, option)
		});
		return value;
	}

	private find($root: any, selector: string) {
		const adds = selector.split('&&');
		selector = adds[0];
		const config = selector.split('|');
		const selectorInfo = config[0].split(':::');
		selector = selectorInfo[0];
		const toRemove = config[1];

		let $el = $root.find(selector);
		if (toRemove) {
			$el.find(toRemove).remove();
		}
		if (selectorInfo[1] === 'reverse') {
			try {
				const $newEl = cheerio('<span></span>');
				$el.each((a, b) => {
					$newEl.prepend(b);
				});
				$el = $newEl;
			} catch(e) {
				console.error(e);
			}
		}
		return $el;
	}
	/*
[
	{
		$: {
			selector: 'a',
			type: 'ATTR'
			resource: 'href'
		}
	}
]

		{
			title: {
				$: {
					selector: 'title',
					type: 'TEXT'
					resource: ''
				}
			}
		}
	
		{
			title: {
				$: {
					selector: 'title'
				},
				name: {
					$: {
						selector: 'title',
						type: 'TEXT'
						resource: ''
					}
				}
			}
		}
	*/
}