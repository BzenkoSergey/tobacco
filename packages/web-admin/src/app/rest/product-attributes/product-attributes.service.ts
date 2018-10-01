import { Mongo } from './../shared';
import { ProductAttributeDto } from './product-attribute.dto';

export class ProductAttributesRestService extends Mongo<ProductAttributeDto> {
	constructor() {
		super('product-attributes');
	}

	protected handleResponse(d: ProductAttributeDto): ProductAttributeDto {
		return new ProductAttributeDto(d);
	}
}
