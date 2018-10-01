import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductAttributeDto, ProductAttributesRestService } from '@rest/product-attributes';

@Component({
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [
		ProductAttributesRestService
	]
})

export class OverviewComponent {
	items: ProductAttributeDto[] = [];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: ProductAttributesRestService
	) {
		this.fetch();
	}

	create() {
		const item = new ProductAttributeDto();
		item.name = 'Placeholder';

		this.service.create(item)
			.subscribe(d => {
				this.router.navigate(['./../../', d._id.$oid], {
					relativeTo: this.route
				});
			});
	}

	fetch() {
		this.service.list()
			.subscribe(list => {
				this.items = list;
			});
	}
}
