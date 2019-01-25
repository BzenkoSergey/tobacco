import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from './../pipes/pipes.service';
// import { ResourceGroupDto } from './resource-group.dto';

@Injectable()
export class SchemesRestService {
	constructor(private restService: PipeRestService) {}

	list(query?: any) {
		return this.restService
			.runSchemeOptions<any[], any>(
				'GET_LIST',
				{
					collection: 'scheme',
					query: query || {},
					modes: ['DB_NO_SYNC']
				}
			)
			// .pipe(
			// 	map(list => {
			// 		return list.map(d => new ResourceGroupDto(d));
			// 	})
			// );
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<any, any>(
				'GET',
				{
					collection: 'scheme',
					id: id
				}
			)
			// .pipe(
			// 	map(d => {
			// 		return new ResourceGroupDto(d);
			// 	})
			// );
	}

	create(d: any) {
		return this.restService
			.runSchemeOptions<any, any>(
				'CREATE',
				{
					collection: 'scheme',
					document: d
				}
			)
			.pipe(
				map(dd => dd.id)
			);
	}

	update(id: string, d: any) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATE',
				{
					collection: 'scheme',
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
					collection: 'scheme',
					id: id
				}
			);
	}
}
