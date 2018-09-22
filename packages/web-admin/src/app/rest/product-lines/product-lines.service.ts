import { Mongo } from './../shared';
import { ProductLineDto } from './product-line.dto';

export class ProductLinesRestService extends Mongo<ProductLineDto> {
	constructor() {
		super('product-lines');
	}

	protected handleResponse(d: ProductLineDto): ProductLineDto {
		return new ProductLineDto(d);
	}
}
