import { Mongo } from './../shared';
import { CategoryDto } from './category.dto';

export class CategoriesRestService extends Mongo<CategoryDto> {
	constructor() {
		super('categories');
	}

	protected handleResponse(d: CategoryDto): CategoryDto {
		return new CategoryDto(d);
	}
}
