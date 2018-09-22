import { DocumentDto, MappingKeyDto } from './../shared';

export class CompanyDto implements DocumentDto {
	_id?: {
		$oid: string
	};
	name: string;
	logo: string;
	mappingKeys: MappingKeyDto[] = [];

	constructor(d?: CompanyDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.logo = d.logo;

		if (d.mappingKeys) {
			this.mappingKeys = d.mappingKeys.map(m => new MappingKeyDto(m));
		}
	}
}
