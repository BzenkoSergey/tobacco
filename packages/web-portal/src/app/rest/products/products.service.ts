import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { ProductFullDto } from './product-full.dto';

type Page = {
	total: number,
	items: ProductFullDto[]
};

@Injectable()
export class ProductsRestService {
	constructor(private http: HttpClient) {}

	list(queries: any) {
		const url = this.apiUrl();
		return this.http.get<Page>(url, { params: queries })
			.pipe(
				map(d => {
					d.items = d.items.map(i => new ProductFullDto(i));
					return d;
				})
			);
	}

	private apiUrl() {
		return `http://localhost:5000/products`;
	}
}