import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of, combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ResourcesRestService, ResourceDto } from '@rest/resources';
import { ResourcesItemsRestService } from '@rest/resources-items';
import { ResourcesProcessedItemsRestService } from '@rest/resources-processed-items';

import { ConfirmComponent } from '@components/confirm/confirm.component';

@Component({
	templateUrl: './processed.html',
	styleUrls: ['./processed.scss'],
	providers: [
		ResourcesRestService,
		ResourcesItemsRestService,
		ResourcesProcessedItemsRestService
	]
})

export class ProcessedComponent implements OnDestroy {
	private sub: Subscription;

	resource = '';
	sortBy = '';
	sortDirection = 'up';

	resources: ResourceDto[] = [];
	versions = new Map<string, any[]>();
	items: any[] = [];
	loading = false;
	searchQuery: string;

	constructor(
		private modalService: NgbModal,
		private resourcesService: ResourcesRestService,
		private service: ResourcesProcessedItemsRestService,
		private router: Router,
		route: ActivatedRoute
	) {
		this.sub = route.queryParams.subscribe(p => {
			this.searchQuery = p.search;
			this.resource = p.resource;
			this.sortBy = p.sortBy;
			this.sortDirection = p.sortDirection || 'up';
			this.fetch();
		});
		this.fetchResources();
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	applyFilters() {
		this.router.navigate([], {
			queryParams: {
				search: this.searchQuery,
				resource: this.resource,
				sortBy: this.sortBy,
				sortDirection: this.sortDirection
			},
			queryParamsHandling: 'merge'
		});
	}

	search() {
		this.router.navigate([], {
			queryParams: {
				search: this.searchQuery
			},
			queryParamsHandling: 'merge'
		});
	}

	selectResource() {
		this.router.navigate([], {
			queryParams: {
				resource: this.resource
			},
			queryParamsHandling: 'merge'
		});
	}

	getProps(item: any) {
		return Object.keys(item);
	}

	isUpdated(url: string, item: any, prop: string) {
		const items = this.versions.get(url);
		const i = items.indexOf(item);
		if (i + 1 === items.length) {
			return false;
		}
		const prev = items[i + 1];
		const value = item[prop];
		const prevValue = prev[prop];
		if (typeof value !== 'object' && typeof prevValue !== 'object') {
			return item[prop] !== prev[prop];
		}
		return JSON.stringify(value) !== JSON.stringify(prevValue);
	}

	getGroups() {
		const keys = [];
		this.versions.forEach((v, k) => {
			keys.push([k, v[0]]);
		});
		return keys.map(a => a[0]);
	}

	getValue(item: any, prop: string) {
		const value = item[prop];
		if (typeof value === 'object') {
			return JSON.stringify(value);
		}
		return item[prop];
	}

	fetch() {
		this.loading = true;
		const query: any = {};

		if (this.searchQuery) {
			query.title = {
				$regex: this.searchQuery,
				$options: 'ig'
			};
		}
		if (this.resource) {
			query.resource = this.resource;
		}

		const sort: any = {};
		if (this.sortBy) {
			sort[this.sortBy] = this.sortDirection === 'down' ? 1 : -1;
		} else {
			sort.version = -1;
		}
		return this.service.list(query, null, null, sort)
			.subscribe(
				d => {
					this.items = d;
					this.handleVerions();
					this.loading = false;
				},
				() => {
					this.loading = false;
				}
			);
	}

	private fetchResources() {
		this.resourcesService.list()
			.subscribe(d => {
				this.resources = d;
			});
	}

	private handleVerions() {
		this.versions = new Map<string, any[]>();
		this.items.forEach(i => {
			let list = this.versions.get(i.url) || [];
			list.push(i);
			list = list.sort((a, b) => {
				return +b.version - +a.version;
			});
			this.versions.set(i.url, list);
		});
	}
}
