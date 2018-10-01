import { DocumentDto } from './../shared';

import { ProductAttributeValueDto } from './product-attribute-value.dto';

export enum ProductAttributeType {
	TEXT = 'TEXT',
	LIST = 'LIST'
}

export class ProductAttributeDto extends DocumentDto {
	name: string;
	type = ProductAttributeType.TEXT;
	values: ProductAttributeValueDto[] = [];

	constructor(d?: ProductAttributeDto) {
		super(d);

		if (!d) {
			return;
		}
		this.name = d.name;
		this.values = d.values;
		this.type = d.type;

		if (d.values) {
			this.values = d.values.map(m => new ProductAttributeValueDto(m));
		}
	}
}
