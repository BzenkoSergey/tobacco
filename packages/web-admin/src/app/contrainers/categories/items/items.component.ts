import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { CategoriesRestService, CategoryDto } from '@rest/categories';

@Component({
	selector: 'categories-items',
	templateUrl: './items.html',
	styleUrls: ['./items.scss'],
	providers: [
		CategoriesRestService
	]
})

export class CategoriesItemsComponent implements OnChanges {
	@Output() selected = new EventEmitter<CategoryDto>();
	@Input() items: CategoryDto[] = [];
	@Input() parent: string;
	@Input() level: number;

	categories: CategoryDto[] = [];

	ngOnChanges() {
		this.categories = this.getParentCategories(this.items);
	}

	select(d: CategoryDto) {
		this.selected.emit(d);
	}

	private getParentCategories(items: CategoryDto[]) {
		return items
			.filter(i => i.parent === this.parent)
			.sort((a, b) => a.order - b.order);
	}
}
