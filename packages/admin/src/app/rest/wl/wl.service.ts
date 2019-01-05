import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from './../pipes/pipes.service';
import { WlDto } from './wl.dto';

@Injectable()
export class WlRestService {
	constructor(private restService: PipeRestService) {}

	get() {
		return this.restService
			.runSchemeOptions<any[], any>(
				'GET_LIST',
				{
					collection: 'wl',
					query: {}
				}
			)
			.pipe(
				map(d => {
					return new WlDto(d[0]);
				})
			);
	}

	create(d: WlDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATE',
				{
					collection: 'wl',
					document: d
				}
			);
	}

	update(id: string, d: WlDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATE',
				{
					collection: 'wl',
					id: id,
					document: d
				}
			);
	}
}
