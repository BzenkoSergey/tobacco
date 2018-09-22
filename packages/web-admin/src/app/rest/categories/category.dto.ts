import { DocumentDto, MappingKeyDto } from './../shared';

export class CategoryDto implements DocumentDto {
	_id?: {
		$oid: string
	};
	name: string;
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
		this.description = d.description;
		this.order = d.order;
		this.parent = d.parent;
		this.logo = d.logo;

		if (d.mappingKeys) {
			this.mappingKeys = d.mappingKeys.map(m => new MappingKeyDto(m));
		}
	}
}
