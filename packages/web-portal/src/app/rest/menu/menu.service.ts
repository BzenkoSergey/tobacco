import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { apiUrl } from './../api';

@Injectable()
export class MenuRestService {
	constructor(private http: HttpClient) {}

	list() {
		const url = this.apiUrl();
		return this.http.get<any>(url);
	}

	private apiUrl() {
		return apiUrl + `menu`;
		// return window.location.protocol + `//` + window.location.hostname + `:5000/menu`;
	}
}
