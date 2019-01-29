import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { WlRestService, WlDto } from '@rest/wl';
import { SchemesRestService } from '@rest/schemes';

@Component({
	templateUrl: './tools.html',
	providers: [
		WlRestService,
		SchemesRestService
	]
})

export class ToolsComponent {
	loading = false;
	saving = false;
	item = new WlDto();
	schemes: any[] = [];

	constructor(
		private service: WlRestService,
		private schemesRestService: SchemesRestService
	) {
		this.fetch();
		this.fetchSchemes();
	}

	save(invalid: boolean) {
		if (invalid) {
			return;
		}
		this.saving = true;
		let sub: Observable<any>;
		if (this.item._id) {
			sub = this.update();
		} else {
			sub = this.create();
		}
		sub.subscribe(
			() => {
				this.saving = false;
				this.fetch();
			},
			() => this.saving = false
		);
	}

	private fetchSchemes() {
		this.schemesRestService
			.list({
				code: {
					$in: ['WL_MOVE_ALL', 'wl-units', 'wl-categories', 'SITEMAP2']
				}
			})
			.subscribe(d => this.schemes = d);
	}

	private create() {
		return this.service.create(this.item);
	}

	private update() {
		return this.service.update(this.item._id, this.item);
	}

	private fetch() {
		this.loading = true;
		this.service.get()
			.subscribe(
				d => {
					console.log(d);
					this.item = d;
					this.loading = false;
				},
				() => this.loading = false
			);
	}
}
