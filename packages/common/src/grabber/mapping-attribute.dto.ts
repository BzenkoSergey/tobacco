import { GrabberTransform } from './transform.enum';
import { GrabberMappingAttributeType } from './mapping-attribute-type.enum';

export class GrabberMappingAttributeDto {
	name: string;
	selector: string;
	root?: boolean;
	type?: GrabberMappingAttributeType;
	attrName?: string;
	transforms: [GrabberTransform, any][] = [];

	constructor(d?: GrabberMappingAttributeDto) {
		if (!d) {
			return;
		}
		this.name = d.name;
		this.selector = d.selector;
		this.root = d.root;
		this.type = d.type;
		this.attrName = d.attrName;
		this.transforms = d.transforms;
	}
}