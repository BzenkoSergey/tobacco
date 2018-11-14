import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GrabberJob } from '@magz/common';

import { MarketDto, MarketsRestService } from '@rest/markets';
import { GrabberRestService, ResultRow, ResultItem } from '@rest/grabber';

@Component({
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [
		MarketsRestService,
		GrabberRestService
	]
})

export class OverviewComponent {
	items: MarketDto[] = [];
	grabbers: GrabberJob[] = [];
	statuses: {
		id: string;
		status: boolean;
	}[] = [];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private grabberService: GrabberRestService,
		private service: MarketsRestService
	) {
		this.fetch();
		this.fetchGrabbers();
		this.fetchStatuses();
	}

	getStatus(jobId: string) {
		return this.statuses.find(g => g.id === jobId);
	}

	getJob(jobId: string) {
		return this.grabbers.find(g => g.id === jobId);
	}

	run(d: MarketDto) {
		let job = this.getJob(d._id.$oid);
		if (job) {
			this.grabberService.run(job)
				.subscribe(f => console.log(f));
			return;
		}
		job = new GrabberJob();
		job.id = d._id.$oid;
		job.config = d.grabber;

		this.grabberService.create(job)
			.subscribe(f => {
				this.grabberService.run(f)
					.subscribe(g => {
						console.log(g);
					});
			});
	}

	fetchStatuses() {
		this.grabberService.statuses()
			.subscribe(d => {
				this.statuses = d;
			});
	}

	fetch() {
		this.service.list()
			.subscribe(list => {
				this.items = list;
			});
	}

	fetchGrabbers() {
		this.grabberService.list()
			.subscribe(d => {
				this.grabbers = d;
			});
	}
}
