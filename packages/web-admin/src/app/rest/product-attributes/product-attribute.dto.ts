import { DocumentDto, MappingKeyDto } from './../shared';

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
	values: string[] = [];
	mappingKeys: MappingKeyDto[] = [];

	constructor(d?: ProductAttributeDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.values = d.values;
		this.type = d.type;

		if (d.mappingKeys) {
			this.mappingKeys = d.mappingKeys.map(m => new MappingKeyDto(m));
		}
	}
}
