import { Mongo } from './../shared';
import { ProductDto } from './product.dto';

export class ProductsRestService extends Mongo<ProductDto> {
	constructor() {
		super('products');
	}

	protected handleResponse(d: ProductDto): ProductDto {
		return new ProductDto(d);
	}
}
