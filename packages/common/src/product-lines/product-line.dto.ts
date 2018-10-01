import { DocumentDto, MappingKeyDto } from './../shared';

export class ProductLineDto extends DocumentDto {
	name: string;
	logo: string;
	company: string;
	mappingKeys: MappingKeyDto[] = [];

	constructor(d?: ProductLineDto) {
		super(d);

		if (!d) {
			return;
		}
		this.name = d.name;
		this.logo = d.logo;
		this.company = d.company;

		if (d.mappingKeys) {
			this.mappingKeys = d.mappingKeys.map(m => new MappingKeyDto(m));
		}
	}
}
