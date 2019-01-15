import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { UnitsRestService, UnitDto } from '@rest/units';
import { PipeRestService } from '@rest/pipes';

@Component({
	templateUrl: './seo.html',
	providers: [
		UnitsRestService,
		PipeRestService
	]
})

export class UnitsDetailsSeoComponent implements OnDestroy {
	private sub: Subscription;

	itemId: string;
	item = new UnitDto();
	loading = false;

	constructor(
		private service: UnitsRestService,
		private pipesService: PipeRestService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.unitId;
			if (this.itemId !== 'new') {
				this.fetch();
			} else {
				this.item = new UnitDto();
			}
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	save(invalid: boolean) {
		if (invalid) {
			return;
		}
		this.loading = true;
		if (!this.item._id) {
			this.service.create(this.item)
				.subscribe(
					(unitId) => {
						this.loading = false;
						this.router.navigate(['../../../../', unitId], {
							relativeTo: this.route,
							queryParamsHandling: 'merge'
						});
					},
					() => this.loading = false
				);
			return;
		}
		this.service.update(this.itemId, this.item)
			.subscribe(
				() => this.loading = false,
				() => this.loading = false
			);
	}

	aggregate() {
		this.pipesService.runSchemeOptions<any, any>(
			'PRODUCT_AGGREGATE',
			{
				data: {
					productId: this.itemId
				}
			}
		)
		.subscribe();
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
