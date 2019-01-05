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
					sort: sort
				}
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<any, any>(
				'GET',
				{
					collection: 'unit-item',
					id: id
				}
			);
	}

	create(d: UnitItemDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATE',
				{
					collection: 'unit-item',
					document: d
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
					document: d
				}
			);
	}

	remove(id: string) {
		return this.restService
			.runSchemeOptions<number, any>(
				'REMOVE',
				{
					collection: 'unit-item',
					id: id
				}
			);
	}
}
