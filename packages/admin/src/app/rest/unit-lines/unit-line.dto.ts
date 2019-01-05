import { MappingKeyDto } from './../shared';

export class UnitLineDto {
	_id: string;
	name: string;
	code: string;
	logo: string;
	company: string;
	mappingKeys: MappingKeyDto[] = [];

	constructor(d?: UnitLineDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.code = d.code;
		this.logo = d.logo;
		this.company = d.company;

		if (d.mappingKeys) {
			this.mappingKeys = d.mappingKeys.map(m => new MappingKeyDto(m));
		}
	}
}
