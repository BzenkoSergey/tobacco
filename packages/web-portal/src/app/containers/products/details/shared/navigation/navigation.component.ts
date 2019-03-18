import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { AggregatedProductDto } from '@rest/products/product-full.dto';
import { MixesRestService } from '@rest/mixes';

@Component({
	selector: 'unit-navigation',
	templateUrl: './navigation.html',
	styleUrls: ['./navigation.scss'],
	providers: [
		MixesRestService
	]
})

export class NavigationComponent implements OnChanges {
	@Input() productId: string;
	@Input() reviews: number;

	hasMixes = false;

	constructor(
		private mixesRestService: MixesRestService,
	) {}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.productId) {
			this.fetchMixes();
		}
	}

	private fetchMixes() {
		this.mixesRestService.list({
			units: [this.productId]
		})
		.subscribe(d => {
			this.hasMixes = !!d.items.length;
		});
	}
}
