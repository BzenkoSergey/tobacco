import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { CompanyDto } from '@magz/common';

@Injectable()
export class CompaniesRestService {
	constructor(private http: HttpClient) {}

	list(queries: any) {
		const url = this.apiUrl();
		return this.http.get<CompanyDto[]>(url)
			.pipe(
				map(d => {
					return d.map(i => new CompanyDto(i));
				})
			);
	}

	private apiUrl() {
		return `http://localhost:5000/companies`;
	}
}
