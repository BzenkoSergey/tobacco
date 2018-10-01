import { DocumentDto, MappingKeyDto } from './../shared';

import { ProductAttributeValueDto } from './product-attribute-value.dto';

export enum ProductAttributeType {
	TEXT = 'TEXT',
	LIST = 'LIST'
}

export class ProductAttributeDto implements DocumentDto {
	_id?: {
		$oid: string
	};
	name: string;
	type = ProductAttributeType.TEXT;
	values: ProductAttributeValueDto[] = [];

	constructor(d?: ProductAttributeDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.values = d.values;
		this.type = d.type;

		if (d.values) {
			this.values = d.values.map(m => new ProductAttributeValueDto(m));
		}
	}
}
