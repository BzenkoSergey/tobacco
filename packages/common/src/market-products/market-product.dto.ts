import { DocumentDto } from './../shared';

export type MarketProductAttribute = {
	name: string,
	value: string
};

export class MarketProductDto extends DocumentDto {
	label: string;
	available: boolean;
	price: number;
	url: string;
	createdDate: string;
	updatedDate: string;

	attributes: MarketProductAttribute[] = [];
	market: string;
	product: string;

	constructor(d?: MarketProductDto) {
		super(d);
		if (!d) {
			return;
		}
		this.label = d.label;
		this.available = d.available;
		this.price = d.price;
		this.url = d.url;
		this.createdDate = d.createdDate;
		this.updatedDate = d.updatedDate;

		this.market = d.market;
		this.product = d.product;
		this.attributes = d.attributes || [];
	}
}
