import { CustomFieldDto } from './custom-field.dto';

export type EntityType = 'category'|'company'|'unit-line'|'unit';

export class CustomFieldsDto {
	_id: string;
	name: string;
	ingoreFields: string[] = [];
	ownerCode: string;
	ownerType: EntityType;
	parentCode: string;
	parentType: EntityType;
	fields: CustomFieldDto[] = [];

	constructor(d?: CustomFieldsDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.ingoreFields = d.ingoreFields;
		this.parentCode = d.parentCode;
		this.parentType = d.parentType;
		this.ownerCode = d.ownerCode;
		this.ownerType = d.ownerType;

		if (d.fields) {
			this.fields = d.fields.map(s => new CustomFieldDto(s));
		}
	}
}
