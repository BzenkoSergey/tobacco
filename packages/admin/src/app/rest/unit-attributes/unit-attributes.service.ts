import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from './../pipes/pipes.service';
import { UnitAttributeDto } from './unit-attribute.dto';

@Injectable()
export class UnitAttributesRestService {
	constructor(private restService: PipeRestService) {}

	list() {
		return this.restService
			.runSchemeOptions<UnitAttributeDto[], any>(
				'GETEXT_LIST',
				{
					collection: 'product-attributes',
					query: {}
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new UnitAttributeDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<UnitAttributeDto, any>(
				'GETEXT',
				{
					collection: 'product-attributes',
					id: id
				}
			)
			.pipe(
				map(d => {
					return new UnitAttributeDto(d);
				})
			);
	}

	create(d: UnitAttributeDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATEEXT',
				{
					collection: 'product-attributes',
					document: d
				}
			);
	}

	update(id: string, d: UnitAttributeDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATEEXT',
				{
					collection: 'product-attributes',
					id: id,
					document: d
				}
			);
	}

	remove(id: string) {
		return this.restService
			.runSchemeOptions<number, any>(
				'REMOVEEXT',
				{
					collection: 'product-attributes',
					id: id
				}
			);
	}
}
