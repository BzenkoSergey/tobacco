import { Injectable } from '@angular/core';

import { PipeRestService } from './../pipes/pipes.service';
import { UnitItemDto } from './unit-item.dto';

@Injectable()
export class UnitItemsRestService {
	constructor(private restService: PipeRestService) {}

	list(query?: any, limit?: number, skip?: number, sort?: any) {
		return this.restService
			.runSchemeOptions<UnitItemDto[], any>(
				'GET_LIST',
				{
					collection: 'unit-item',
					query: query || {},
					limit: limit,
					skip: skip,
					sort: sort,
					modes: ['DB_NO_SYNC']
				}
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<any, any>(
				'GET',
				{
					collection: 'unit-item',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			);
	}

	create(d: UnitItemDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATE',
				{
					collection: 'unit-item',
					document: d,
					modes: ['DB_NO_SYNC']
				}
			);
	}

	update(id: string, d: UnitItemDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATE',
				{
					collection: 'unit-item',
					id: id,
					document: d,
					modes: ['DB_NO_SYNC']
				}
			);
	}

	remove(id: string) {
		return this.restService
			.runSchemeOptions<number, any>(
				'REMOVE',
				{
					collection: 'unit-item',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			);
	}
}
