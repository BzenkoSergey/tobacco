import { MappingKeyDto } from './../shared';

export class CompanyDto {
	_id: string;
	name: string;
	code: string;
	logo: string;
	mappingKeys: MappingKeyDto[] = [];

	constructor(d?: CompanyDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.code = d.code;
		this.logo = d.logo;

		if (d.mappingKeys) {
			this.mappingKeys = d.mappingKeys.map(m => new MappingKeyDto(m));
		}
	}
}
