import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { PipeDto } from './pipe.dto';

@Injectable()
export class PipeRestService {
	constructor(private http: HttpClient) {}

	runSchemeOptions<T, K>(schemeCode: string, options: K) {
		const url = this.apiUrl() + '/scheme/code/' + schemeCode + '/options';
		return this.http.post<T>(url, options);
	}

	list() {
		return this.runSchemeOptions<PipeDto[], any>(
				'GET_LIST',
				{
					collection: 'pipes',
					query: {}
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new PipeDto(d));
				})
			);
	}

	apiUrl() {
		return `http://` + window.location.hostname + `:3330`;
	}
}
