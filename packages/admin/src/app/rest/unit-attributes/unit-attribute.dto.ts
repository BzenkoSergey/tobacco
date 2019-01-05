import { UnitAttributeValueDto } from './unit-attribute-value.dto';

export enum UnitAttributeType {
	TEXT = 'TEXT',
	LIST = 'LIST'
}

export class UnitAttributeDto {
	_id: string;
	name: string;
	code: string;
	type = UnitAttributeType.TEXT;
	values: UnitAttributeValueDto[] = [];

	constructor(d?: UnitAttributeDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.code = d.code;
		this.values = d.values;
		this.type = d.type;

		if (d.values) {
			this.values = d.values.map(m => new UnitAttributeValueDto(m));
		}
	}
}
