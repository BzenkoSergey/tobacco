import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { GrabberMappingAttributeDto, GrabberTransform } from '@magz/common';
import { MarketsRestService, MarketDto } from '@rest/markets';
import { GrabberSettingsDto, GrabberSettingsRestService } from '@rest/grabber-settings';
import { GrabberRestService } from '@rest/grabber';

@Component({
	templateUrl: './settings.html',
	// styleUrls: ['./details.scss'],
	providers: [
		MarketsRestService,
		GrabberSettingsRestService,
		GrabberRestService
	]
})

export class SettingsComponent implements OnInit {
	loading = false;
	item = new GrabberSettingsDto();

	constructor(
		private service: GrabberSettingsRestService,
		private grabberRestService: GrabberRestService
	) {}

	ngOnInit() {
		this.fetch();
	}

	run2() {
		this.grabberRestService.fetchScheduler()
			.subscribe(d => {
				console.log(d);
			});
	}

	run() {
		this.grabberRestService.runScheduler()
			.subscribe(d => {
				console.log(d);
			});
	}

	save() {
		this.loading = true;

		this.item._id ? this.service.update(this.item) : this.service.create(this.item)
			.subscribe(
				d => {
					this.loading = false;
					this.item = d;
				},
				e => this.loading = false
			);
	}

	private fetch() {
		this.loading = true;
		this.service.list()
			.subscribe(
				list => {
					this.loading = false;
					this.item = list[0] || new GrabberSettingsDto();
				},
				() => this.loading = false
			);
	}
}
