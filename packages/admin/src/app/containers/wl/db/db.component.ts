import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { WlRestService, WlDto } from '@rest/wl';

@Component({
	templateUrl: './db.html',
	providers: [
		WlRestService
	]
})

export class DbComponent {
	loading = false;
	saving = false;
	item = new WlDto();

	constructor(private service: WlRestService) {
		this.fetch();
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
