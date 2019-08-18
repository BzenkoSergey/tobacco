import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { apiUrl } from './../api';

type SearchQueriesDto = {
	query: string;
};

@Injectable()
export class SearchRestService {
	constructor(
		private http: HttpClient,
		@Inject(DOCUMENT) private document: Document,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	list(queries: SearchQueriesDto) {
		const url = this.apiUrl();
		return this.http.get<SearchQueriesDto[]>(url, { params: queries });
	}

	create(body: SearchQueriesDto) {
		const url = this.apiUrl();
		return this.http.post<SearchQueriesDto[]>(url, body);
	}

	private apiUrl() {
		return apiUrl(this.document, isPlatformBrowser(this.platformId), false) + `search`;
	}
}
