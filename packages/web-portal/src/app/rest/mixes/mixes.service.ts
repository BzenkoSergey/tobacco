import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { map } from 'rxjs/operators';

import { apiUrl } from './../api';

type Page = {
	total: number,
	items: any[]
};

@Injectable()
export class MixesRestService {
	constructor(
		private http: HttpClient,
		@Inject(DOCUMENT) private document: Document,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

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
		return apiUrl(this.document, isPlatformBrowser(this.platformId), false) + `mixes`;
	}
}
