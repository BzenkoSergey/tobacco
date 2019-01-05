import { MappingKeyDto } from './../shared';

export class UnitAttributeValueDto {
	value: string;
	code: string;
	mappingKeys: MappingKeyDto[] = [];

	constructor(d?: UnitAttributeValueDto) {
		if (!d) {
			return;
		}
		this.value = d.value;
		this.code = d.code;
		if (d.mappingKeys) {
			this.mappingKeys = d.mappingKeys.map(m => new MappingKeyDto(m));
		}
	}
}
