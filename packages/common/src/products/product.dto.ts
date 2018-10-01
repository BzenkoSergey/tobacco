import { MappingKeyDto, DocumentDto } from './../shared';

export class ProductDto extends DocumentDto {
	name: string;
	logo: string;
	company: string;
	mappingKeys: MappingKeyDto[] = [];
	productLine: string;
	productAttributes: string[] = [];
	categories: string[] = [];

	constructor(d?: ProductDto) {
		super(d);

		if (!d) {
			return;
		}
		this.name = d.name;
		this.logo = d.logo;
		this.company = d.company;
		this.productLine = d.productLine;
		this.productAttributes = d.productAttributes;
		this.categories = d.categories;

		if (d.mappingKeys) {
			this.mappingKeys = d.mappingKeys.map(m => new MappingKeyDto(m));
		}
	}
}
