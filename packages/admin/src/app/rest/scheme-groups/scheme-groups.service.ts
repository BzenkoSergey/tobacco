import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from './../pipes/pipes.service';
import { SchemeGroupDto } from './scheme-group.dto';

@Injectable()
export class SchemeGroupsRestService {
	constructor(private restService: PipeRestService) {}

	list() {
		return this.restService
			.runSchemeOptions<SchemeGroupDto[], any>(
				'GET_LIST',
				{
					collection: 'scheme-group',
					query: {}
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new SchemeGroupDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<SchemeGroupDto, any>(
				'GET',
				{
					collection: 'scheme-group',
					id: id
				}
			)
			.pipe(
				map(d => {
					return new SchemeGroupDto(d);
				})
			);
	}

	create(d: SchemeGroupDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATE',
				{
					collection: 'scheme-group',
					document: d
				}
			);
	}

	update(id: string, d: SchemeGroupDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATE',
				{
					collection: 'scheme-group',
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
					collection: 'resource-group',
					id: id
				}
			);
	}
}
