import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { apiUrl } from './../api';

@Injectable()
export class AnalyticsRestService {
	constructor(private http: HttpClient) {}

	create(body: any) {
		const url = this.apiUrl();
		return this.http.post<any>(url, body);
	}

	private apiUrl() {
		return apiUrl + `analytics`;
	}
}
