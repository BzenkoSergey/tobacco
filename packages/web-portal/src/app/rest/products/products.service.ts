import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { AggregatedProductDto } from './product-full.dto';

import { apiUrl } from './../api';

type Page = {
	total: number,
	items: AggregatedProductDto[]
};

@Injectable()
export class ProductsRestService {
	constructor(private http: HttpClient) {}

	list(queries: any) {
		const url = this.apiUrl();
		return this.http.get<Page>(url, { params: queries })
			.pipe(
				map(d => {
					d.items = d.items.map(i => new AggregatedProductDto(i));
					return d;
				})
			);
	}

	get(unitCode: string) {
		const url = this.apiUrl() + '/' + unitCode;
		return this.http.get<AggregatedProductDto>(url)
			.pipe(
				map(d => {
					return new AggregatedProductDto(d);
				})
			);
	}

	private apiUrl() {
		// return window.location.protocol + `//api.` + window.location.hostname + `/products`;
		return apiUrl + `products`;
	}
}
