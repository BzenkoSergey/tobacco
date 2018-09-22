const cheerio = require('cheerio');

import { GrabberMappingAttributeDto, GrabberMappingDto } from '@magz/common';

import { TransformsService } from './transforms/transforms.service';

type Entity = { [key: string]: string; }

export class EntitiesHandlerService {
	transformsService = new TransformsService();

	constructor(
		private mapping: GrabberMappingDto
	) {}

	handle(html: string): [Entity[], Entity] {
		const entitis = this.parse(html);
		let addition = null;
		if(this.mapping.additions) {
			addition = this.parseAdditions(html);
		}
		return [entitis, addition];
	}

	private parseAdditions(html: string): Entity {
		const $ = cheerio.load(html);
		const $root = $('html');
		return this.parseEntity(this.mapping.additions, $root);
	}

	private parse(html: string): Entity[] {
		const $ = cheerio.load(html);
		const $roots = $(this.mapping.selector);

		return $roots.toArray()
			.map((root: JQuery<HTMLElement>) => {
				return this.parseEntity(this.mapping.attributes, $(root));
			});
	}

	private parseEntity(attrs: GrabberMappingAttributeDto[], $root: JQuery<HTMLElement>): Entity {
		var entity = {};
		attrs.forEach(attr => {
			const $el = attr.root ? $root : $root.find(attr.selector);
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