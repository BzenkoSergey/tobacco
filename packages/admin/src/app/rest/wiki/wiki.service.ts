import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from '../pipes/pipes.service';
import { WikiDto } from './wiki.dto';

@Injectable()
export class WikiRestService {
	constructor(private restService: PipeRestService) {}

	list(query?: any, limit?: number, skip?: number, sort?: any) {
		return this.restService
			.runSchemeOptions<WikiDto[], any>(
				'GET_LIST',
				{
					collection: 'wiki',
					query: query || {},
					limit: limit,
					skip: skip,
					sort: sort,
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new WikiDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<WikiDto, any>(
				'GET',
				{
					collection: 'wiki',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(d => {
					return new WikiDto(d);
				})
			);
	}

	create(d: WikiDto) {
		return this.restService
			.runSchemeOptions<any, any>(
				'CREATE',
				{
					collection: 'wiki',
					document: d,
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(f => f.id)
			);
	}

	update(id: string, d: WikiDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATE',
				{
					collection: 'wiki',
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
					collection: 'wiki',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			);
	}
}
