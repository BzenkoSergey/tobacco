import { DocumentDto, MappingKeyDto } from './../shared';

export class ProductLineDto implements DocumentDto {
	_id?: {
		$oid: string
	};
	name: string;
	logo: string;
	company: string;
	mappingKeys: MappingKeyDto[] = [];

	constructor(d?: ProductLineDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.logo = d.logo;
		this.company = d.company;

		if (d.mappingKeys) {
			this.mappingKeys = d.mappingKeys.map(m => new MappingKeyDto(m));
		}
	}
}
