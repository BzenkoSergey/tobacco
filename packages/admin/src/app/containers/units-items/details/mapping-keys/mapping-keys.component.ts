import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { UnitsRestService, UnitDto } from '@rest/units';

@Component({
	templateUrl: './mapping-keys.html',
	providers: [
		UnitsRestService
	]
})

export class UnitsDetailsMappingKeysComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	item = new UnitDto();
	loading = false;

	constructor(
		private service: UnitsRestService,
		route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.unitId;
			this.fetch();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	save() {
		this.loading = true;
		this.service.update(this.itemId, this.item)
			.subscribe(
				() => this.loading = false,
				() => this.loading = false
			);
	}

	private fetch() {
		this.loading = true;
		this.service.get(this.itemId)
			.subscribe(
				d => {
					this.item = d;
					this.loading = false;
				},
				() => this.loading = false
			);
	}
}
