import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { ProductAttributeDto } from '@magz/common';

@Injectable()
export class ProductAttributesRestService {
	constructor(private http: HttpClient) {}

	list(queries: any) {
		const url = this.apiUrl();
		return this.http.get<ProductAttributeDto[]>(url)
			.pipe(
				map(d => {
					return d.map(i => new ProductAttributeDto(i));
				})
			);
	}

	private apiUrl() {
		return `http://localhost:5000/product-attributes`;
	}
}
