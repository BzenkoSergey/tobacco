import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { MarketProductDto } from '@magz/common';

@Injectable()
export class MarketProductsRestService {
	constructor(private http: HttpClient) {}

	list(queries: any) {
		const url = this.apiUrl();
		return this.http.get<MarketProductDto[]>(url)
			.pipe(
				map(d => {
					return d.map(i => new MarketProductDto(i));
				})
			);
	}

	private apiUrl() {
		return `http://localhost:5000/market-products`;
	}
}
