import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from '../pipes/pipes.service';
import { UnitLineDto } from './unit-line.dto';

@Injectable()
export class UnitLinesRestService {
	constructor(private restService: PipeRestService) {}

	list() {
		return this.restService
			.runSchemeOptions<UnitLineDto[], any>(
				'GETEXT_LIST',
				{
					collection: 'product-lines',
					query: {},
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new UnitLineDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<UnitLineDto, any>(
				'GETEXT',
				{
					collection: 'product-lines',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(d => {
					return new UnitLineDto(d);
				})
			);
	}

	create(d: UnitLineDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATEEXT',
				{
					collection: 'product-lines',
					document: d,
					modes: ['DB_NO_SYNC']
				}
			);
	}

	update(id: string, d: UnitLineDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATEEXT',
				{
					collection: 'product-lines',
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
					collection: 'product-lines',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			);
	}
}
