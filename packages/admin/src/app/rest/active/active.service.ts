import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ActiveRestService {
	constructor(private http: HttpClient) {}

	list(schemeId: string, background = false) {
		const url = this.apiUrl(background) + `/${schemeId}`;
		return this.http.get<string[]>(url);
	}

	get(schemeId: string, processId: string, background = false) {
		const url = this.apiUrl(background) + `/${schemeId}/${processId}`;
		return this.http.get<string[]>(url);
	}

	private apiUrl(background = false) {
		let port = 3330;
		if (background) {
			port = 3331;
		}
		return `http://` + window.location.hostname + `:${port}/active`;
	}
}
