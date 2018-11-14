import { Mongo } from './../shared';
import { ProductSearchDto } from './products-search.dto';

export class ProductsSearchRestService extends Mongo<ProductSearchDto> {
	constructor() {
		super('products-search');
	}

	protected handleResponse(d: ProductSearchDto): ProductSearchDto {
		return new ProductSearchDto(d);
	}
}
