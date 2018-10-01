import { ProductDto, MarketProductDto } from '@magz/common';

export class ProductFullDto extends ProductDto {
	items: MarketProductDto[] = [];

	constructor(d?: ProductFullDto) {
		super(d);
		if (!d) {
			return;
		}
		this.items = d.items.map(i => {
			return new MarketProductDto(i);
		});
	}
}
