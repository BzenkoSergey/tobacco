import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { CategoriesRestService, CategoryDto } from '@rest/categories';

@Component({
	templateUrl: './categories.html',
	styleUrls: ['./categories.scss'],
	providers: [
		CategoriesRestService
	]
})

export class CategoriesComponent implements OnDestroy {
	private sub: Subscription;
	items: CategoryDto[] = [];
	itemId: string;
	placeholder: CategoryDto;

	constructor(
		private router: Router,
		private service: CategoriesRestService,
		route: ActivatedRoute
	) {
		this.fetch();
		this.sub = route.queryParams.subscribe(p => {
			this.itemId = p.itemId;
			this.defineItem();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	createPlaceholder() {
		const d = new CategoryDto();
		d.name = 'Placeholder';
		this.setPlaceholder(d);
	}

	createChildPlaceholder(d: CategoryDto) {
		this.createPlaceholder();
		this.placeholder.parent = d._id;
	}

	setPlaceholder(d: CategoryDto) {
		this.placeholder = d;
		if (d._id) {
			this.router.navigate([], {
				queryParams: {
					itemId: d._id
				},
				queryParamsHandling: 'merge'
			});
		}
	}

	create(d) {
		this.service.create(d)
			.subscribe(s => {
				this.fetch();
				d._id = s;
				this.setPlaceholder(d);
			});
	}

	remove(d) {
		this.service.remove(d._id)
			.subscribe(() => {
				this.fetch();
				this.setPlaceholder(null);
			});
	}

	update(d: CategoryDto) {
		this.service.update(d._id, d)
			.subscribe(r => {
				this.fetch();
				this.setPlaceholder(d);
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
				this.defineItem();
			});
	}

	private defineItem() {
		if (!this.itemId) {
			return;
		}
		this.placeholder = this.items.find(i => i._id === this.itemId);
	}
}
