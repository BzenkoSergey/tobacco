import { Component } from '@angular/core';

import { Subject } from 'rxjs';

import { CategoriesRestService, CategoryDto } from '@rest/categories';

@Component({
	templateUrl: './categories.html',
	styleUrls: ['./categories.scss'],
	providers: [
		CategoriesRestService
	]
})

export class CategoriesComponent {
	items: CategoryDto[] = [];
	placeholder: CategoryDto;

	constructor(
		private service: CategoriesRestService
	) {
		this.fetch();
	}

	createPlaceholder() {
		const d = new CategoryDto();
		d.name = 'Placeholder';
		this.setPlaceholder(d);
	}

	createChildPlaceholder(d: CategoryDto) {
		this.createPlaceholder();
		this.placeholder.parent = d._id.$oid;
	}

	setPlaceholder(d: CategoryDto) {
		this.placeholder = d;
	}

	create(d) {
		this.service.create(d)
			.subscribe(s => {
				this.fetch();
				this.setPlaceholder(s);
			});
	}

	remove(d) {
		this.service.remove(d)
			.subscribe(() => {
				this.fetch();
				this.setPlaceholder(null);
			});
	}

	update(d: CategoryDto) {
		this.service.update(d)
			.subscribe(r => {
				this.fetch();
				this.setPlaceholder(r);
				console.log(r);
			});
	}

	save(d: CategoryDto) {
		if (d._id) {
			this.update(d);
			return;
		}
		this.create(d);
	}

	private fetch() {
		this.service.list()
			.subscribe(d => {
				this.items = d;
			});
	}
}
