import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { MixesRestService } from '@rest/mixes';

@Component({
	selector: 'unit-navigation',
	templateUrl: './navigation.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		MixesRestService
	]
})

export class NavigationComponent implements OnChanges {
	@Input() productId: string;
	@Input() reviews: number;

	hasMixes = false;
	baseUrl = './';

	constructor(
		private router: Router,
		private cd: ChangeDetectorRef,
		private mixesRestService: MixesRestService,
	) {}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.productId) {
			this.fetchMixes();
		}
		this.baseUrl = this.router.url
			.replace(/\?(.*)/, '')
			.replace(/(\/prices)|(\/mixes)|(\/characteristics)|(\/reviews)/, '');
		this.cd.markForCheck();
	}

	private fetchMixes() {
		this.mixesRestService.list({
			units: [this.productId]
		})
		.subscribe(d => {
			this.hasMixes = !!d.items.length;
			this.cd.markForCheck();
		});
	}
}
