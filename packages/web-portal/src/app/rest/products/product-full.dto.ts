export class AggregatedBaseDto {
	id: string;
	name: string;
	logo: string;
	code: string;

	constructor(d?: AggregatedBaseDto) {
		if (!d) {
			return;
		}
		this.id = d.id;
		this.name = d.name;
		this.logo = d.logo;
		this.code = d.code;
	}
}

export class AggregatedProductAttributeDto {
	name: string;
	id: string;
	values: string[] = [];
	value: string;

	constructor(d?: AggregatedProductAttributeDto) {
		if (!d) {
			return;
		}
		this.id = d.id;
		this.name = d.name;
		this.value = d.value;
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
	originName: string;
	translate: string;
	description: string;
	logo: string;
	company: AggregatedBaseDto;
	productLine: AggregatedBaseDto;
	productAttributes: AggregatedProductAttributeDto[] = [];
	categories: AggregatedBaseDto[] = [];
	items: AggregatedProductItemDto[] = [];
	seo: any;
	fields: any[] = [];
	reviews = 0;
	reviewsRating = 0;

	constructor(d?: AggregatedProductDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.productId = d.productId;
		this.reviews = d.reviews;
		this.reviewsRating = d.reviewsRating;
		this.readableName = d.readableName;
		this.name = d.name;
		this.description = d.description;
		this.fields = d.fields || [];
		this.logo = d.logo;
		this.company = new AggregatedBaseDto(d.company);
		this.productLine = new AggregatedBaseDto(d.productLine);
		this.seo = d.seo;
		if (d.productAttributes) {
			this.productAttributes = d.productAttributes.map(i => new AggregatedProductAttributeDto(i));
		}
		if (d.categories) {
			this.categories = d.categories.map(i => new AggregatedBaseDto(i));
		}
		if (d.items) {
			this.items = d.items.map(i => new AggregatedProductItemDto(i));
		}

		const names = d.name.split(' / ');
		this.originName = names.length > 1 ? names[1] : names[0];
		this.translate = names.length > 1 ? names[0] : '';
	}
}
