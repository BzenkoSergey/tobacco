import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';

export type FilterItem = {
	name?: string;
	value?: string;
};

@Component({
	selector: 'filter-items',
	templateUrl: './filter-items.html',
	styleUrls: ['./filter-items.scss']
})

export class FilterItemsComponent implements OnChanges {
	@Output() selected = new EventEmitter<FilterItem[]>();
	@Input() items: FilterItem[] = [];
	@Input() selectedItems = new Map<FilterItem, boolean>();

	displayed: FilterItem[] = [];
	search = '';

	ngOnChanges() {
		if (!this.selectedItems) {
			this.selectedItems = new Map<FilterItem, boolean>();
		}
		this.defineDisplayed();
	}

	select(i: FilterItem) {
		const status = !this.selectedItems.get(i);
		this.selectedItems.set(i, status);
		this.emitSelected();
	}

	defineDisplayed() {
		this.displayed = this.items.filter(i => {
			const line = i.name || i.value;
			return !!line.match(new RegExp(this.search, 'i'));
		});
	}

	private emitSelected() {
		const selected = Array.from(this.selectedItems)
			.filter(v => v[1])
			.map(v => v[0]);

		this.selected.emit(selected);
	}
}
