import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { GrabberJob } from '@magz/common';

import { MarketDto, MarketsRestService } from '@rest/markets';
import { GrabberRestService, ResultRow, ResultItem } from '@rest/grabber';

export type Link = {
	link: string;
	items: ResultItem[];
};

@Component({
	templateUrl: './links.html',
	styleUrls: ['./links.scss'],
	providers: [
		GrabberRestService
	]
})

export class LinksComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	activeTab = 0;
	search = '';
	status = false;
	time: any;
	items: ResultRow[] = [];
	links: Link[] = [];
	emptyLinks: Link[] = [];
	contentLinks: Link[] = [];

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

	setTab(tabIndex: number) {
		this.activeTab = tabIndex;
	}

	performSearch() {
		if (this.activeTab === 0) {
			if (!this.search) {
				this.emptyLinks = this.links.filter(i => !i.items.length);
				return;
			}
			this.emptyLinks = this.links
				.filter(i => !i.items.length)
				.filter(i => {
					return i.link.match(new RegExp(this.search, 'i'));
				});
			return;
		}
		if (!this.search) {
			this.contentLinks = this.links.filter(i => i.items.length);
			return;
		}
		this.contentLinks = this.links
			.filter(i => i.items.length)
			.filter(i => {
				return i.items.some(item => {
					return !!item.label.match(new RegExp(this.search, 'i'));
				});
			});
	}

	trackLinksByFn(i: number, item: Link) {
		return item.link;
	}

	private defineLinks(items: ResultRow[]) {
		return items.map(i => {
			const link = i[0];
			const linkItems = i[1][0];
			return {
				link: link,
				items: linkItems
			};
		});
	}

	private fetchStatus() {
		return this.service.status(this.itemId);
	}

	private fetch() {
		clearTimeout(this.time);
		this.service.stream(this.itemId)
			.subscribe(d => {
				const links = this.defineLinks(d);
				if (links.length !== this.links.length) {
					this.links = this.defineLinks(d);
					this.emptyLinks = this.links.filter(l => !l.items.length);
					this.contentLinks = this.links.filter(l => l.items.length);
				}
				this.time = setTimeout(() => {
					this.fetch();
				}, 2000);
				if (!this.status) {
					clearTimeout(this.time);
				}
			});
	}
}
