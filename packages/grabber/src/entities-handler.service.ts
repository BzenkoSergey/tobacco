const cheerio = require('cheerio');

import { GrabberMappingAttributeDto, GrabberMappingDto } from '@magz/common';

import { TransformsService } from './transforms/transforms.service';

type Entity = { [key: string]: string; }

export class EntitiesHandlerService {
	transformsService = new TransformsService();

	constructor(
		private mapping: GrabberMappingDto
	) {}

	handle(html: string, url: string): [Entity[], Entity] {
		const entitis = this.parse(html, url);
		let addition = null;
		if(this.mapping.additions) {
			addition = this.parseAdditions(html, url);
		}
		return [entitis, addition];
	}

	private parseAdditions(html: string, url: string): Entity {
		const $ = cheerio.load(html);
		const $root = $('html');
		return this.parseEntity(this.mapping.additions, $root, url);
	}

	private parse(html: string, url: string): Entity[] {
		const $ = cheerio.load(html);
		const $roots = $(this.mapping.selector);

		return $roots.toArray()
			.map((root: JQuery<HTMLElement>) => {
				return this.parseEntity(this.mapping.attributes, $(root), url);
			});
	}

	private parseEntity(attrs: GrabberMappingAttributeDto[], $root: JQuery<HTMLElement>, url: string): Entity {
		var entity = {};
		attrs.forEach(attr => {
			if (attr.selector === '$url') {
				entity[attr.name] = url;
				return;
			}
			const config = attr.selector.split('|');
			const selectorInfo = config[0].split(':::');
			const selector = selectorInfo[0];
			const toRemove = config[1];

			let $el = attr.root ? $root : $root.find(selector);
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
			let value = null;
			if(attr.type === 'VALUE') {
				value = $el.val();
			}
			if(attr.type === 'ATTR') {
				value = $el.attr(attr.attrName);
			}
			if(!attr.type || attr.type === 'TEXT') {
				value = $el.text();
			}

			attr.transforms.forEach(transform => {
				value = this.transformsService.perform(value, transform[0], transform[1])
			});

			entity[attr.name] = value;
		});
		return entity;
	}
}