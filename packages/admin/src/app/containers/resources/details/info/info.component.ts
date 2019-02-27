import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { ResourcesRestService, ResourceDto } from '@rest/resources';
import { PipeRestService } from '@rest/pipes';

@Component({
	templateUrl: './info.html',
	providers: [
		ResourcesRestService,
		PipeRestService
	]
})

export class InfoComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	saving = false;
	item = new ResourceDto();

	constructor(
		private service: ResourcesRestService,
		private pipesService: PipeRestService,
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

	changeProtocol() {
		const info = new URL(this.item.path);
		this.pipesService.runSchemeOptions<any, any>(
			'CHANGE_PROTOCOL',
			{
				//data: {
					resourceId : this.itemId,
					protocol: info.protocol
				//}
			}
		)
		.subscribe();
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
