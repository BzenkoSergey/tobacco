import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GrabberInputDto } from '@magz/common';

export type ResultItem = {
	available: boolean;
	image: string;
	label: string;
	price: number;
	url: string;
};

export type ResultRow = [string, [ResultItem[], any]];

@Injectable()
export class GrabberRestService {
	constructor(private http: HttpClient) {}

	create(d: GrabberInputDto) {
		const url = this.apiUrl();
		return this.http.post<ResultRow[]>(url, d);
	}

	private apiUrl() {
		return `http://localhost:3000/grabber`;
	}
}
