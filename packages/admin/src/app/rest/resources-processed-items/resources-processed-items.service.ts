import { Injectable } from '@angular/core';

import { PipeRestService } from './../pipes/pipes.service';

@Injectable()
export class ResourcesProcessedItemsRestService {
	constructor(private restService: PipeRestService) {}

	list(query?: any, limit?: number, skip?: number, sort?: any) {
		return this.restService
			.runSchemeOptions<any[], any>(
				'GET_LIST',
				{
					collection: 'resource-processed-item',
					query: query || {},
					limit: limit,
					skip: skip,
					sort: sort
				}
			);
	}

	aggregate(query?: any) {
		return this.restService
			.runSchemeOptions<any[], any>(
				'GET_LIST',
				{
					collection: 'resource-processed-item',
					query: query || {},
					aggregate: true
				}
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<any, any>(
				'GET',
				{
					collection: 'resource-processed-item',
					id: id
				}
			);
	}

	create(d: any) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATE',
				{
					collection: 'resource-processed-item',
					document: d
				}
			);
	}

	update(id: string, d: any) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATE',
				{
					collection: 'resource-processed-item',
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
					collection: 'resource-processed-item',
					id: id
				}
			);
	}
}
