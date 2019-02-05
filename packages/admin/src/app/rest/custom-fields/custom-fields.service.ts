import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from './../pipes/pipes.service';
import { CustomFieldsDto } from './custom-fields.dto';

@Injectable()
export class CustomFieldsRestService {
	private collection = 'custom-fields';
	constructor(private restService: PipeRestService) {}

	list(query?: any) {
		return this.restService
			.runSchemeOptions<CustomFieldsDto[], any>(
				'GET_LIST',
				{
					collection: this.collection,
					query: query || {},
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new CustomFieldsDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<CustomFieldsDto, any>(
				'GET',
				{
					collection: this.collection,
					id: id,
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(d => {
					return new CustomFieldsDto(d);
				})
			);
	}

	create(d: CustomFieldsDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATE',
				{
					collection: this.collection,
					document: d
				}
			);
	}

	update(id: string, d: CustomFieldsDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATE',
				{
					collection: this.collection,
					id: id,
					document: d
				}
			);
	}

	remove(id: string) {
		return this.restService
			.runSchemeOptions<number, any>(
				'REMOVE',
				{
					collection: this.collection,
					id: id
				}
			);
	}
}
