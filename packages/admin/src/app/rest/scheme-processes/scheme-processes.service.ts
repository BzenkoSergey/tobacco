import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { PipeRestService } from './../pipes/pipes.service';
// import { ResourceGroupDto } from './resource-group.dto';

@Injectable()
export class SchemeProcessesRestService {
	constructor(
		private http: HttpClient,
		private restService: PipeRestService
	) {}

	list(query?: any) {
		query = query || {};

		const url = this.restService.apiUrl(false) + '/pp';
		return this.http.get(url, {
			params: query
		});

		// query.modes = ['DB_NO_SYNC'];
		// return this.restService
		// 	.runSchemeOptions<any[], any>(
		// 		'PROCESSES',
		// 		query || {}
		// 	);
	}

	get(id: string, schemeId: string) {
		const query = {
			processId: id,
			schemeId: schemeId
		};

		const url = this.restService.apiUrl(false) + '/pp';
		return this.http.get(url, {
			params: query
		});

		// return this.restService
		// 	.runSchemeOptions<any, any>(
		// 		'PROCESSES',
		// 		{
		// 			processId: id,
		// 			schemeId: schemeId,
		// 			modes: ['DB_NO_SYNC']
		// 			// _id: '$' + id
		// 		}
		// 	)
		// 	.pipe(
		// 		map(d => d[0])
		// 	);
	}

	createWithData(schemeId: string, data: any, background = false) {
		const url = this.restService.apiUrl(background) + '/scheme/' + schemeId + '/options';
		return this.http.post(url, data);
	}

	create(schemeId: string, background = false) {
		const url = this.restService.apiUrl(background) + '/scheme/' + schemeId;
		return this.http.get(url);
	}

	run(processId: string, background = false) {
		const url = this.restService.apiUrl(background) + '/process/' + processId;
		return this.http.get<any[]>(url);
	}

	runPaths(processId: string, paths: string[], background = false) {
		const url = this.restService.apiUrl(background) + '/process/' + processId + '/paths/' + paths.join(',');
		return this.http.get<any[]>(url);
	}

	update(id: string, d: any) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATE',
				{
					collection: 'scheme-processes',
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
					collection: 'scheme-processes',
					id: id
				}
			);
	}

	removeAll(query: any) {
		return this.restService
			.runSchemeOptions<number, any>(
				'REMOVE',
				{
					collection: 'scheme-processes',
					query: query
				}
			);
	}
}
