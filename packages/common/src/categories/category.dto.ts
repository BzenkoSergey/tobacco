import { DocumentDto, MappingKeyDto } from './../shared';

export class CategoryDto extends DocumentDto {
	name: string;
	description: string;
	logo: string;
	order = 0;
	parent: string;
	mappingKeys: MappingKeyDto[] = [];

	constructor(d?: CategoryDto) {
		super(d);

		if (!d) {
			return;
		}
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
