import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from '../pipes/pipes.service';
import { UnitDto } from './unit.dto';

@Injectable()
export class UnitsRestService {
	constructor(private restService: PipeRestService) {}

	list(query?: any, limit?: number, skip?: number, sort?: any) {
		return this.restService
			.runSchemeOptions<UnitDto[], any>(
				'GETEXT_LIST',
				{
					collection: 'products',
					query: query || {},
					limit: limit,
					skip: skip,
					sort: sort,
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new UnitDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<UnitDto, any>(
				'GETEXT',
				{
					collection: 'products',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(d => {
					return new UnitDto(d);
				})
			);
	}

	create(d: UnitDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATEEXT',
				{
					collection: 'products',
					document: d,
					modes: ['DB_NO_SYNC']
				}
			);
	}

	update(id: string, d: UnitDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATEEXT',
				{
					collection: 'products',
					id: id,
					document: d,
					modes: ['DB_NO_SYNC']
				}
			);
	}

	remove(id: string) {
		return this.restService
			.runSchemeOptions<number, any>(
				'REMOVEEXT',
				{
					collection: 'products',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			);
	}
}
