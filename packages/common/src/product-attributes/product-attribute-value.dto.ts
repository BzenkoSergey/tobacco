import { MappingKeyDto } from './../shared';

export class ProductAttributeValueDto {
	value: string;
	mappingKeys: MappingKeyDto[] = [];

	constructor(d?: ProductAttributeValueDto) {
		if (!d) {
			return;
		}
		this.value = d.value;
		if (d.mappingKeys) {
			this.mappingKeys = d.mappingKeys.map(m => new MappingKeyDto(m));
		}
	}
}
