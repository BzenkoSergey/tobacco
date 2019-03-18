import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { apiUrl } from './../api';

import { WikiDto } from './wiki.dto';

@Injectable()
export class WikiRestService {
	constructor(private http: HttpClient) {}

	list(queries: any) {
		const url = this.apiUrl();
		return this.http.get<WikiDto[]>(url, { params: queries })
			.pipe(
				map(d => {
					return d.map(i => new WikiDto(i));
				})
			);
	}

	private apiUrl() {
		// return window.location.protocol + `//api.` + window.location.hostname + `/products`;
		return apiUrl + `wiki`;
	}
}
