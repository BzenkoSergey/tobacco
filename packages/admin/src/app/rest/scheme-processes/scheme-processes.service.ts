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
		return this.restService
			.runSchemeOptions<any[], any>(
				'PROCESSES',
				query || {}
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<any, any>(
				'PROCESSES',
				{
					processId: id
					// _id: '$' + id
				}
			)
			.pipe(
				map(d => d[0])
			);
	}

	createWithData(schemeId: string, data: any) {
		const url = this.restService.apiUrl() + '/scheme/' + schemeId + '/options';
		return this.http.post(url, data);
	}

	create(schemeId: string) {
		const url = this.restService.apiUrl() + '/scheme/' + schemeId;
		return this.http.get(url);
	}

	run(processId: string) {
		const url = this.restService.apiUrl() + '/process/' + processId;
		return this.http.get<any[]>(url);
	}

	runPaths(processId: string, paths: string[]) {
		const url = this.restService.apiUrl() + '/process/' + processId + '/paths/' + paths.join(',');
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
