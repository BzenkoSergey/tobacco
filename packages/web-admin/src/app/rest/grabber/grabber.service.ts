import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { GrabberJob } from '@magz/common';

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

	list() {
		const url = this.apiUrl();
		return this.http.get<GrabberJob[]>(url)
			.pipe(
				map(list => {
					return list.map(d => new GrabberJob(d));
				})
			);
	}

	get(jobId: string) {
		const url = this.apiUrl() + '/' + jobId;
		return this.http.get<GrabberJob>(url)
			.pipe(
				map(d => {
					if (!d) {
						return null;
					}
					return new GrabberJob(d);
				})
			);
	}

	statuses() {
		const url = this.apiUrl() + '/status';
		return this.http.get<{ id: string, status: boolean}[]>(url);
	}

	status(jobId: string) {
		const url = this.apiUrl() + '/' + jobId + '/status';
		return this.http.get<boolean>(url);
	}

	create(d: GrabberJob) {
		const url = this.apiUrl() + '/' + d.id;
		return this.http.post<GrabberJob>(url, d)
			.pipe(
				map(r => new GrabberJob(r))
			);
	}

	createAll(d: GrabberJob[]) {
		const url = this.apiUrl();
		return this.http.post<GrabberJob[]>(url, d)
			.pipe(
				map(list => {
					return list.map(r => new GrabberJob(r));
				})
			);
	}

	update(d: GrabberJob) {
		const url = this.apiUrl() + '/' + d.id;
		return this.http.put<GrabberJob>(url, d)
			.pipe(
				map(r => new GrabberJob(r))
			);
	}

	stream(jobId: string) {
		const url = this.apiUrl() + '/' + jobId + '/stream';
		return this.http.get<ResultRow[]>(url);
	}

	streams() {
		const url = this.apiUrl() + '/stream';
		return this.http.get<ResultRow[][]>(url);
	}

	fetchScheduler() {
		const url = this.apiUrl() + '/scheduler';
		return this.http.get<any>(url);
	}

	runScheduler() {
		const url = this.apiUrl() + '/scheduler';
		return this.http.post<boolean>(url, {});
	}

	run(d: GrabberJob) {
		const url = this.apiUrl() + '/' + d.id + '/run';
		return this.http.post<boolean>(url, d);
	}

	partiallyRun(d: GrabberJob) {
		const url = this.apiUrl() + '/' + d.id + '/partially/run';
		return this.http.post<boolean>(url, d);
	}

	runAll(d: GrabberJob[]) {
		const url = this.apiUrl() + '/run';
		return this.http.post<boolean>(url, d);
	}

	private apiUrl() {
		return `http://localhost:3300/job`;
	}
}



// @Injectable()
// export class GrabberRestService {
// 	constructor(private http: HttpClient) {}

// 	create(d: GrabberInputDto) {
// 		const url = this.apiUrl();
// 		return this.http.post<ResultRow[]>(url, d);
// 	}

// 	get(host: string) {
// 		const url = this.apiUrl() + '/' + host;
// 		return this.http.get<ResultRow[]>(url);
// 	}

// 	status(host: string) {
// 		const url = this.apiUrl() + '/status/' + host;
// 		return this.http.get<boolean>(url);
// 	}

// 	private apiUrl() {
// 		return `http://localhost:3000/grabber`;
// 	}
// }

