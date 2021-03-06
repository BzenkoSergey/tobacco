import { DocumentDto, MappingKeyDto } from './../shared';

export class ProductDto implements DocumentDto {
	_id?: {
		$oid: string
	};
	name: string;
	translate = '';
	logo: string;
	company: string;
	mappingKeys: MappingKeyDto[] = [];
	productLine: string;
	productAttributes: string[] = [];
	categories: string[] = [];
	visible = false;

	constructor(d?: ProductDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.translate = d.translate || '';
		this.logo = d.logo;
		this.company = d.company;
		this.productLine = d.productLine;
		this.productAttributes = d.productAttributes;
		this.categories = d.categories;
		this.visible = d.visible;

		if (d.mappingKeys) {
			this.mappingKeys = d.mappingKeys.map(m => new MappingKeyDto(m));
		}
	}
}
