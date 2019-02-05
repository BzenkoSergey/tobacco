import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { UnitsRestService, UnitDto } from '@rest/units';

@Component({
	templateUrl: './custom-fields.html',
	providers: [
		UnitsRestService
	]
})

// company id
export class UnitsDetailsCustomFieldsComponent implements OnDestroy {
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

	isArray(d: any) {
		return Array.isArray(d);
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
