import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { ProductAttributeDto, ProductAttributesRestService, ProductAttributeValueDto } from '@rest/product-attributes';

@Component({
	templateUrl: './details.html',
	styleUrls: ['./details.scss'],
	providers: [
		ProductAttributesRestService
	]
})

export class DetailsComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	loading = false;
	item = new ProductAttributeDto();

	constructor(
		private service: ProductAttributesRestService,
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
		const d = new ProductAttributeValueDto();
		this.item.values.unshift(d);
		console.log(this.item);
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
