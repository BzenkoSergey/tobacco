import { Mongo } from './../shared';
import { MarketProductDto } from './market-product.dto';

export class MarketProductsRestService extends Mongo<MarketProductDto> {
	constructor() {
		super('market-products');
	}

	protected handleResponse(d: MarketProductDto): MarketProductDto {
		return new MarketProductDto(d);
	}
}
