import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { ResourcesRestService, ResourceDto } from '@rest/resources';

@Component({
	templateUrl: './settings.html',
	providers: [
		ResourcesRestService
	]
})

export class SettingsComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	saving = false;
	item = new ResourceDto();

	constructor(
		private service: ResourcesRestService,
		route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.resourceId;
			this.fetch();
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
		this.saving = true;
		this.service.update(this.itemId, this.item)
			.subscribe(
				() => this.saving = false,
				() => this.saving = false
			);
	}

	private fetch() {
		this.service.get(this.itemId)
			.subscribe(
				d => {
					this.item = d;
				}
			);
	}
}
