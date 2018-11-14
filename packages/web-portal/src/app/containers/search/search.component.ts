import { Component, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { debounceTime, filter } from 'rxjs/operators';

import { SearchRestService } from '@rest/search';

@Component({
	selector: 'search',
	templateUrl: './search.html',
	styleUrls: ['./search.scss'],
	providers: [
		SearchRestService
	]
})

export class SearchComponent implements OnChanges {
	@Output() changed = new EventEmitter<string>();
	@Input() query = '';

	searchProducts: { query: string }[] = [];
	control = new FormControl();
	index = -1;

	constructor(
		private searchRestService: SearchRestService
	) {
		this.control.valueChanges
			.pipe(
				debounceTime(300)
			)
			.subscribe(d => {
				this.query = d;
				if (!d) {
					this.resetAutocomplete();
					return;
				}
				this.fetchProductsBySearch(d);
			});
	}

	ngOnChanges() {
		this.control.setValue(this.query, {
			emitEvent: false
		});
	}

	down(e: KeyboardEvent) {
		if (!['ArrowDown', 'ArrowUp'].includes(e.code)) {
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
		this.control.setValue(query, {
			emitEvent: false
		});
		this.performSearch();
	}

	performSearch() {
		this.query = this.control.value;
		this.index = -1;
		this.searchProducts = [];
		this.changed.emit(this.query);
	}

	resetAutocomplete() {
		this.index = -1;
		this.searchProducts = [];
	}

	fetchProductsBySearch(text: string) {
		this.searchRestService
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
			query = this.query;
		} else {
			query = this.searchProducts[this.index].query;
		}
		this.control.setValue(query, {
			emitEvent: false
		});
	}
}
