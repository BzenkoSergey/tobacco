import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FiltersRestService {
	constructor(private http: HttpClient) {}

	list() {
		const url = this.apiUrl();
		return this.http.get<any[]>(url);
	}

	private apiUrl() {
		return `http://localhost:5000/settings`;
	}
}
