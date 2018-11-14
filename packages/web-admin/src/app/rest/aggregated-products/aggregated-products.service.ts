import { Mongo } from './../shared';
import { AggregatedProductDto } from './aggregated-product.dto';

export class AggregatedProductsRestService extends Mongo<AggregatedProductDto> {
	constructor() {
		super('aggregated-products');
	}

	protected handleResponse(d: AggregatedProductDto): AggregatedProductDto {
		return new AggregatedProductDto(d);
	}
}
