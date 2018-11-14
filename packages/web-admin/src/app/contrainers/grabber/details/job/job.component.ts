import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { GrabberJob } from '@magz/common';

import { MarketDto, MarketsRestService } from '@rest/markets';
import { GrabberRestService, ResultRow, ResultItem } from '@rest/grabber';

@Component({
	templateUrl: './job.html',
	styleUrls: ['./job.scss'],
	providers: [
		GrabberRestService
	]
})

export class JobComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	status = false;
	time: any;
	items: ResultRow[] = [];
	loading = false;

	constructor(
		private service: GrabberRestService,
		route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.marketId;

			this.fetchStatus()
				.subscribe(d => {
					this.status = d;
					this.fetch();
				});
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
		if (this.time) {
			clearTimeout(this.time);
		}
	}

	private fetchStatus() {
		return this.service.status(this.itemId);
	}

	private fetch() {
		clearTimeout(this.time);
		this.service.stream(this.itemId)
			.subscribe(d => {
				this.items = d.reverse();
				this.time = setTimeout(() => {
					this.fetch();
				}, 2000);
				if (!this.status) {
					clearTimeout(this.time);
				}
			});
	}
}
