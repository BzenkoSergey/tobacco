import { DocumentDto, MappingKeyDto } from './../shared';

export class CompanyDto extends DocumentDto {
	name: string;
	logo: string;
	mappingKeys: MappingKeyDto[] = [];

	constructor(d?: CompanyDto) {
		super(d);

		if (!d) {
			return;
		}
		this.name = d.name;
		this.logo = d.logo;

		if (d.mappingKeys) {
			this.mappingKeys = d.mappingKeys.map(m => new MappingKeyDto(m));
		}
	}
}
