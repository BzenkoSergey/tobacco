import { Subject, Observable } from 'rxjs';

import { DocumentDto } from './document.dto';

export abstract class Mongo<T extends DocumentDto> {
	private badabase = 'https://api.mlab.com/api/1/databases/tobacco';
	private apiKey = '9UxYMuHYHmellW_9udyW2Y-vmVfFvP1E';

	constructor(private collection: string) {}

	list(query: {} = null, sort: {} = null, pageSize = 100000): Observable<T[]> {
		const queryLine = query ? JSON.stringify(query) : '';
		let sortLine = '';
		if (sort) {
			sortLine =  '&s=' + JSON.stringify(sort);
		}

		const url = this.getCollectionWithApiKeyUrl() + '&l=' + pageSize + '&q=' + queryLine + sortLine;
		return this.sendBodyRequest<T[]>('GET', url, null);
	}

	get(id: string) {
		const url = this.getDocumentUrl(id);
		return this.sendBodyRequest<T>('GET', url, null);
	}

	create(d: T): Observable<T> {
		const url = this.getCollectionWithApiKeyUrl();
		return this.sendBodyRequest<T>('POST', url, d);
	}

	update(d: T): Observable<T> {
		const url = this.getDocumentUrl(d._id.$oid);
		return this.sendBodyRequest<T>('PUT', url, d);
	}

	remove(d: T): Observable<never> {
		const url = this.getDocumentUrl(d._id.$oid);
		return this.sendBodyRequest<never>('DELETE', url, null, true);
	}

	protected abstract handleResponse(d: T): T;

	protected getDocumentUrl(id: string) {
		return this.getCollectionUrl() + '/' + id + '?apiKey=' + this.apiKey;
	}

	protected getCollectionWithApiKeyUrl() {
		return this.getCollectionUrl() + '?apiKey=' + this.apiKey;
	}

	protected getCollectionUrl() {
		return this.badabase + '/collections/' + this.collection;
	}

	private sendBodyRequest<K>(method: string, url: string, body: any, noResponse = false): Subject<K> {
		const subj = new Subject<K>();
		const xhr = new XMLHttpRequest();

		xhr.open(method, url, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		if (body) {
			xhr.send(JSON.stringify(body));
		} else {
			xhr.send();
		}

		xhr.onreadystatechange = () => {
			if (xhr.readyState !== 4) {
				return;
			}
			if (xhr.status !== 200) {
				subj.error(null);
				return;
			}

			if (!noResponse) {
				const response = JSON.parse(xhr.responseText);
				let data;
				if (Array.isArray(response)) {
					data = response.map(i => this.handleResponse(i));
				} else {
					data = this.handleResponse(response);
				}
				subj.next(data);
			} else {
				subj.next();
			}
			subj.complete();
		};
		return subj;
	}
}
