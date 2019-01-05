import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from './../pipes/pipes.service';
import { CategoryDto } from './category.dto';

@Injectable()
export class CategoriesRestService {
	constructor(private restService: PipeRestService) {}

	list() {
		return this.restService
			.runSchemeOptions<CategoryDto[], any>(
				'GETEXT_LIST',
				{
					collection: 'categories',
					query: {}
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new CategoryDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<CategoryDto, any>(
				'GETEXT',
				{
					collection: 'categories',
					id: id
				}
			)
			.pipe(
				map(d => {
					return new CategoryDto(d);
				})
			);
	}

	create(d: CategoryDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATEEXT',
				{
					collection: 'categories',
					document: d
				}
			);
	}

	update(id: string, d: CategoryDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATEEXT',
				{
					collection: 'categories',
					id: id,
					document: d
				}
			);
	}

	remove(id: string) {
		return this.restService
			.runSchemeOptions<number, any>(
				'REMOVEEXT',
				{
					collection: 'categories',
					id: id
				}
			);
	}
}
