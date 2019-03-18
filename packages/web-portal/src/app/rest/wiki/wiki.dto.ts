import { WikiType } from './wiki-type.enum';
import { WikiFieldDto } from './wiki-field.dto';

export class WikiDto {
	_id: string;
	type = WikiType.NONE;
	createdDate: string;
	updatedDate: string;
	title: string;
	mapping: any;
	fields: WikiFieldDto[] = [];
	entity: string;
	visible = true;
	meta: any;

	constructor(d?: WikiDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.type = d.type;
		this.createdDate = d.createdDate;
		this.updatedDate = d.updatedDate;
		this.title = d.title;
		this.entity = d.entity;
		this.visible = d.visible;
		this.mapping = d.mapping;
		this.meta = d.meta || {};
		if (d.fields) {
			this.fields = d.fields.map(f => new WikiFieldDto(f));
		}
	}
}
