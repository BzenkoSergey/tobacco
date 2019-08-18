import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { map } from 'rxjs/operators';

import { apiUrl } from './../api';

import { WikiDto } from './wiki.dto';

@Injectable()
export class WikiRestService {
	constructor(
		private http: HttpClient,
		@Inject(DOCUMENT) private document: Document,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

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
		return apiUrl(this.document, isPlatformBrowser(this.platformId), true) + `wiki`;
	}
}
