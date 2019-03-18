import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { apiUrl } from './../api';

type SearchQueriesDto = {
	query: string;
};

@Injectable()
export class SearchRestService {
	constructor(private http: HttpClient) {}

	list(queries: SearchQueriesDto) {
		const url = this.apiUrl();
		return this.http.get<SearchQueriesDto[]>(url, { params: queries });
	}

	create(body: SearchQueriesDto) {
		const url = this.apiUrl();
		return this.http.post<SearchQueriesDto[]>(url, body);
	}

	private apiUrl() {
		// return window.location.protocol + `//api.` + window.location.hostname + `/search`;
		return apiUrl + `search`;
	}
}
