import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { MarketDto } from '@magz/common';

@Injectable()
export class MarketsRestService {
	constructor(private http: HttpClient) {}

	list(queries: any) {
		const url = this.apiUrl();
		return this.http.get<MarketDto[]>(url)
			.pipe(
				map(d => {
					return d.map(i => new MarketDto(i));
				})
			);
	}

	private apiUrl() {
		return `http://localhost:5000/markets`;
	}
}
