import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class ImagesRestService {
	constructor(private http: HttpClient) {}

	create(productId: string, image: File) {
		const url = this.apiUrl() + '/' + productId;
		const formData = new FormData();
		formData.append('file', image, image.name);

		return this.http.post(url, formData);
	}

	list() {
		const url = this.apiUrl();
		return this.http.get<string[]>(url);
	}

	sync(imagePath: string) {
		const url = this.apiUrl() + '/file/' + imagePath + '/sync';
		return this.http.post(url, {});
	}

	syncAll() {
		const url = this.apiUrl() + '/file/sync';
		return this.http.post(url, {});
	}

	private apiUrl() {
		return `http://`+ window.location.hostname +`:3310/images`;
	}
}
