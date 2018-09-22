import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { ProductAttributeDto, ProductLinesRestService, ProductAttributeType } from '@rest/product-attributes';

@Component({
	templateUrl: './details.html',
	styleUrls: ['./details.scss'],
	providers: [
		ProductLinesRestService
	]
})

export class DetailsComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	loading = false;
	item = new ProductAttributeDto();

	constructor(
		private service: ProductLinesRestService,
		route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.companyId;
			this.fetch();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	createValue() {
		this.item.values.unshift('Placeholder');
	}

	removeValue(i: number) {
		this.item.values.splice(i, 1);
	}

	save() {
		this.loading = true;
		this.service.update(this.item)
			.subscribe(
				d => {
					this.loading = false;
					this.item = d;
				},
				e => this.loading = false
			);
	}

	private fetch() {
		this.loading = true;
		this.service.get(this.itemId)
			.subscribe(
				d => {
					this.loading = false;
					this.item = d;
				},
				e => this.loading = false
			);
	}
}
