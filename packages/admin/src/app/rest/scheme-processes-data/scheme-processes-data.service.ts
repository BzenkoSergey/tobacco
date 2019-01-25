import { Injectable } from '@angular/core';

import { PipeRestService } from './../pipes/pipes.service';

@Injectable()
export class SchemeProcessesDataRestService {
	constructor(
		private restService: PipeRestService
	) {}

	get(id: string) {
		return this.restService
			.runSchemeOptions<any, any>(
				'GET',
				{
					collection: 'scheme-processes-data',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			);
	}
}
