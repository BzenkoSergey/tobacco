import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { ProductLineDto } from '@magz/common';

@Injectable()
export class ProductLinesRestService {
	constructor(private http: HttpClient) {}

	list(queries: any) {
		const url = this.apiUrl();
		return this.http.get<ProductLineDto[]>(url)
			.pipe(
				map(d => {
					return d.map(i => new ProductLineDto(i));
				})
			);
	}

	private apiUrl() {
		return `http://localhost:5000/product-lines`;
	}
}
