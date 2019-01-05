import { MappingKeyDto } from './../shared';

export class CategoryDto {
	_id: string;
	name: string;
	code: string;
	description: string;
	logo: string;
	order = 0;
	parent: string;
	mappingKeys: MappingKeyDto[] = [];

	constructor(d?: CategoryDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.code = d.code;
		this.description = d.description;
		this.order = d.order;
		this.parent = d.parent;
		this.logo = d.logo;

		if (d.mappingKeys) {
			this.mappingKeys = d.mappingKeys.map(m => new MappingKeyDto(m));
		}
	}
}
