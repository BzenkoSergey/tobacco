import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { WikiRestService, WikiDto } from '@rest/wiki';

@Component({
	templateUrl: './meta.html',
	providers: [
		WikiRestService
	]
})

export class WikiDetailsMetaComponent implements OnDestroy {
	private sub: Subscription;

	itemId: string;
	item = new WikiDto();
	loading = false;

	constructor(
		private service: WikiRestService,
		route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.id;
			if (this.itemId !== 'new') {
				this.fetch();
			} else {
				this.item = new WikiDto();
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
