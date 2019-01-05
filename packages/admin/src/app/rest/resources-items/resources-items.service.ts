import { Injectable } from '@angular/core';

import { PipeRestService } from './../pipes/pipes.service';

@Injectable()
export class ResourcesItemsRestService {
	constructor(private restService: PipeRestService) {}

	list(query?: any, limit?: number, skip?: number, sort?: any) {
		return this.restService
			.runSchemeOptions<any[], any>(
				'GET_LIST',
				{
					collection: 'resource-item',
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
					collection: 'resource-item',
					id: id
				}
			);
	}

	create(d: any) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATE',
				{
					collection: 'resource-item',
					document: d
				}
			);
	}

	update(id: string, d: any) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATE',
				{
					collection: 'resource-item',
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
					collection: 'resource-item',
					id: id
				}
			);
	}
}
