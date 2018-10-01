import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { CategoryDto } from '@magz/common';

@Injectable()
export class CategoriesRestService {
	constructor(private http: HttpClient) {}

	list(queries: any) {
		const url = this.apiUrl();
		return this.http.get<CategoryDto[]>(url)
			.pipe(
				map(d => {
					return d.map(i => new CategoryDto(i));
				})
			);
	}

	private apiUrl() {
		return `http://localhost:5000/categories`;
	}
}
