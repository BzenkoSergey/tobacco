import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { apiUrl } from './../api';

type Page = {
	total: number,
	items: any[]
};

@Injectable()
export class MixesRestService {
	constructor(private http: HttpClient) {}

	list(queries: any) {
		const url = this.apiUrl();
		return this.http.get<Page>(url, { params: queries })
			.pipe(
				map(d => {
					return d;
				})
			);
	}

	get(unitCode: string) {
		const url = this.apiUrl() + '/' + unitCode;
		return this.http.get<any>(url)
			.pipe(
				map(d => {
					return d;
				})
			);
	}

	private apiUrl() {
		// return window.location.protocol + `//api.` + window.location.hostname + `/products`;
		return apiUrl + `mixes`;
	}
}
