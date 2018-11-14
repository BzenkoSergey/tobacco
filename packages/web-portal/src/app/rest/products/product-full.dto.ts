export class AggregatedBaseDto {
	id: string;
	name: string;
	logo: string;

	constructor(d?: AggregatedBaseDto) {
		if (!d) {
			return;
		}
		this.id = d.id;
		this.name = d.name;
		this.logo = d.logo;
	}
}

export class AggregatedProductAttributeDto {
	name: string;
	id: string;
	values: string[] = [];

	constructor(d?: AggregatedProductAttributeDto) {
		if (!d) {
			return;
		}
		this.id = d.id;
		this.name = d.name;
		this.values = d.values || [];
	}
}

export class AggregatedProductItemDto {
	id: string;
	available: boolean;
	price: number;
	url: string;
	market: AggregatedBaseDto;
	productAttributes: AggregatedProductAttributeDto[] = [];

	constructor(d?: AggregatedProductItemDto) {
		if (!d) {
			return;
		}
		this.id = d.id;
		this.available = d.available;
		this.price = d.price;
		this.url = d.url;
		this.market = new AggregatedBaseDto(d.market);
		if (d.productAttributes) {
			this.productAttributes = d.productAttributes.map(i => {
				return new AggregatedProductAttributeDto(i);
			});
		}
	}
}

export class AggregatedProductDto {
	_id?: {
		$oid: string
	};
	productId: string;
	readableName: string;
	name: string;
	logo: string;
	company: AggregatedBaseDto;
	productLine: AggregatedBaseDto;
	productAttributes: AggregatedProductAttributeDto[] = [];
	categories: AggregatedBaseDto[] = [];
	items: AggregatedProductItemDto[] = [];

	constructor(d?: AggregatedProductDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.productId = d.productId;
		this.readableName = d.readableName;
		this.name = d.name;
		this.logo = d.logo;
		this.company = new AggregatedBaseDto(d.company);
		this.productLine = new AggregatedBaseDto(d.productLine);
		if (d.productAttributes) {
			this.productAttributes = d.productAttributes.map(i => new AggregatedProductAttributeDto(i));
		}
		if (d.categories) {
			this.categories = d.categories.map(i => new AggregatedBaseDto(i));
		}
		if (d.items) {
			this.items = d.items.map(i => new AggregatedProductItemDto(i));
		}
	}
}
