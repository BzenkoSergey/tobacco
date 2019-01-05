import { Injectable } from '@angular/core';

import { PipeRestService } from './../pipes/pipes.service';

@Injectable()
export class SchemeProcessesOptionsRestService {
	constructor(
		private restService: PipeRestService
	) {}

	get(id: string) {
		return this.restService
			.runSchemeOptions<any, any>(
				'GET',
				{
					collection: 'scheme-processes-options',
					id: id
				}
			);
	}
}
