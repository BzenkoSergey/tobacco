import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ImagesRestService } from '@rest/images';

@Component({
	templateUrl: './images.html',
	providers: [
		ImagesRestService
	]
})
export class ImagesComponent implements OnDestroy {
	private sub: Subscription;

	loading = false;
	items: string[] = [];
	syncing: string;
	page = 0;
	perPage = 20;

	constructor(
		private service: ImagesRestService,
		private router: Router,
		route: ActivatedRoute
	) {
		this.fetch();
		this.sub = route.queryParams.subscribe(p => {
			this.page = isNaN(+p.page) ? 0 : +p.page;
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	changePage(page: string) {
		this.router.navigate([], {
			queryParams: {
				page: page
			}
		});
	}

	fetch() {
		this.service.list()
			.subscribe(d => this.items = d);
	}

	syncAll() {
		this.syncing = 'all';
		this.service.sync(this.items)
			.subscribe(
				this.syncing = null,
				() => this.syncing = null
			);
	}

	sync(path: string) {
		this.syncing = path;

		this.service.resize([path])
			.subscribe(
				() => {
					this.service.sync([path])
						.subscribe(
							d => this.syncing = null,
							() => this.syncing = null
						);
				},
				() => this.syncing = null
			);
	}

	genUrl(path: string) {
		return 'http://' + window.location.hostname + ':3330/scheme/code/IMG_DOWMLOAD/options?path=' + path + '&isFile=true';
	}
}
