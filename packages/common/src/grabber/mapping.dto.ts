import { GrabberMappingAttributeDto } from './mapping-attribute.dto';

export class GrabberMappingDto {
	selector: string;
	attributes: GrabberMappingAttributeDto[] = [];
	additions?: GrabberMappingAttributeDto[] = [];

	constructor(d?: GrabberMappingDto) {
		if (!d) {
			return;
		}
		this.selector = d.selector;
		this.attributes = d.attributes.map(a => new GrabberMappingAttributeDto(a));
		if (d.additions) {
			this.additions = d.additions.map(a => new GrabberMappingAttributeDto(a));
		}
	}
};