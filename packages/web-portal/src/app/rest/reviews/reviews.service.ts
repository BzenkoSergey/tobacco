import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { ReviewDto } from './review.dto';
import { apiUrl } from './../api';

type Page = {
	total: number,
	items: ReviewDto[]
};

@Injectable()
export class ReviewsRestService {
	constructor(private http: HttpClient) {}

	list(queries: any) {
		const url = this.apiUrl();
		return this.http.get<Page>(url, { params: queries })
			.pipe(
				map(d => {
					d.items = d.items.map(i => new ReviewDto(i));
					return d;
				})
			);
	}

	private apiUrl() {
		return apiUrl + `reviews`;
	}
}
