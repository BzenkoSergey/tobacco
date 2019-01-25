import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from './../pipes/pipes.service';
import { ResourceDto } from './resource.dto';

@Injectable()
export class ResourcesRestService {
	constructor(private restService: PipeRestService) {}

	list() {
		return this.restService
			.runSchemeOptions<ResourceDto[], any>(
				'GET_LIST',
				{
					collection: 'resource',
					query: {},
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new ResourceDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<ResourceDto, any>(
				'GET',
				{
					collection: 'resource',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(d => {
					return new ResourceDto(d);
				})
			);
	}

	create(d: ResourceDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATE',
				{
					collection: 'resource',
					document: d
				}
			);
	}

	update(id: string, d: ResourceDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATE',
				{
					collection: 'resource',
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
					collection: 'resource',
					id: id
				}
			);
	}
}
