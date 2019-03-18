import { Component, EventEmitter, Output, Input } from '@angular/core';

import { Subscription } from 'rxjs';

import { SearchRestService } from '@rest/search';

@Component({
	selector: 'search',
	templateUrl: './search.html',
	styleUrls: ['./search.scss'],
	providers: [
		SearchRestService
	]
})

export class SearchComponent {
	@Output() changed = new EventEmitter<string>();
	@Input() query = '';
	originQuery = '';

	private sub: Subscription;

	searchProducts: { query: string }[] = [];
	index = -1;
	timeout: number|null = null;

	constructor(
		private searchRestService: SearchRestService
	) {}

	keyup(e: KeyboardEvent) {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		if (!!~['ArrowDown', 'ArrowUp', 'Enter'].indexOf(e.code)) {
			return;
		}
		this.query = (e.target as HTMLInputElement).value;
		this.originQuery = this.query;
		this.timeout = setTimeout(() => {
			if (!this.query) {
				this.resetAutocomplete();
				return;
			}
			this.fetchProductsBySearch(this.query);
		}, 200);
	}

	down(e: KeyboardEvent) {
		if (!~['ArrowDown', 'ArrowUp'].indexOf(e.code)) {
			return;
		}

		if (e.code === 'ArrowDown') {
			if (this.index >= (this.searchProducts.length - 1)) {
				this.index = -1;
			} else {
				this.index = this.index + 1;
			}
		}

		if (e.code === 'ArrowUp') {
			if (this.index === -1) {
				this.index = this.searchProducts.length - 1;
			} else {
				this.index = this.index - 1;
			}
		}
		this.select();
	}

	setQuery(query: string) {
		this.query = query;
		this.performSearch();
	}

	performSearch(e?: Event) {
		if (e) {
			e.preventDefault();
		}
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		if (this.sub) {
			this.sub.unsubscribe();
		}
		this.index = -1;
		this.searchProducts = [];
		this.changed.emit(this.query);
	}

	resetAutocomplete() {
		setTimeout(() => {
			this.index = -1;
			this.searchProducts = [];
		}, 300);
	}

	fetchProductsBySearch(text: string) {
		this.sub = this.searchRestService
			.list({
				query: text
			})
			.subscribe(list => {
				this.searchProducts = list;
			});
	}

	private select() {
		let query = '';
		if (this.index === -1) {
			query = this.originQuery || this.query;
		} else {
			this.originQuery = this.originQuery || this.query;
			query = this.searchProducts[this.index].query;
		}
		this.query = query;
	}
}
