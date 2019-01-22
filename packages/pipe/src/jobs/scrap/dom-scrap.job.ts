const cheerio = require('cheerio');
import { GrabberTransform } from './transforms/transform.enum';
import { TransformsService } from './transforms/transforms.service';
import { async } from './../../async';
import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';
import * as URL from 'URL';

export class DomScrapJob implements Job {
	private options: any;
	staticOptions: any;
	schemeId: string;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
	}

	setDI(di: DI) {
		return this;
	}

	setPipePath(path: string) {
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
		console.log('////////==========');
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

	private parse(dom: any, config: any, url: string) {
		if (typeof config === 'string') {
			return config;
		}
		if (typeof config === 'number') {
			return config;
		}
		
		if (config.$ && config.$.selector === '$url') {
			return url;
		}
		if (config.$ && config.$.selector === '$scheme') {
			return this.schemeId;
		}

		// console.log(dom);
		if (Array.isArray(config)) {
			let items = [];
			config.forEach(c => {
				items = items.concat(this.parse(dom, c, url));
			});
			return items;
		}
		if(!config.$ || !config.$.type) {
			let segment = dom;
			if (config.$ && config.$.selector) {
				segment = this.find(dom, config.$.selector);
			}
			const obj = {};
			Object.keys(config)
				.forEach(prop => {
					if (prop === '$') {
						return;
					}
					obj[prop] = this.parse(segment, config[prop], url);
				});
			return obj;
		}
		const $el = this.find(dom, config.$.selector);

		if (config.$.type === 'ATTR') {
			if ($el.length > 1) {
				return $el.toArray()
					.map(f => this.checkValue(cheerio(f).attr(config.$.resource), config.$.selector, url));
			}
			return this.runTransforms(this.checkValue($el.attr(config.$.resource), config.$.selector, url), config.$.transforms);
		}
		const text = config.$.contentType !== 'HTML' ? $el.text() : $el.html();
		return this.runTransforms(this.checkValue(text, config.$.selector, url), config.$.transforms);
	}

	private checkValue(value: string, selector: string, url: string) {
		if (!value || !(value.trim())) {
			return value;
		}
		const adds = selector.split('&&');
		if (adds.length === 1) {
			return value;
		}
		const vars = adds[1].split(',');
		console.log(vars, '0000000');
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