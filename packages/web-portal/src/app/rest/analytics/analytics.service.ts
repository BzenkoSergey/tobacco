import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { apiUrl } from './../api';

@Injectable()
export class AnalyticsRestService {
	constructor(
		private http: HttpClient,
		@Inject(DOCUMENT) private document: Document,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	create(body: any) {
		const url = this.apiUrl();
		return this.http.post<any>(url, body);
	}

	private apiUrl() {
		return apiUrl(this.document, isPlatformBrowser(this.platformId), false) + `analytics`;
	}
}
