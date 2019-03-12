import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from '../pipes/pipes.service';
import { UnitMixDto } from './unit-mix.dto';

@Injectable()
export class UnitMixesRestService {
	constructor(private restService: PipeRestService) {}

	list() {
		return this.restService
			.runSchemeOptions<UnitMixDto[], any>(
				'GETEXT_LIST',
				{
					collection: 'unit-mixes',
					query: {},
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new UnitMixDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<UnitMixDto, any>(
				'GETEXT',
				{
					collection: 'unit-mixes',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(d => {
					return new UnitMixDto(d);
				})
			);
	}

	create(d: UnitMixDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATEEXT',
				{
					collection: 'unit-mixes',
					document: d,
					modes: ['DB_NO_SYNC']
				}
			);
	}

	update(id: string, d: UnitMixDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATEEXT',
				{
					collection: 'unit-mixes',
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
					collection: 'unit-mixes',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			);
	}
}
