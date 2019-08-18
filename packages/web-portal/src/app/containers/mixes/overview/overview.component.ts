import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, combineLatest } from 'rxjs';

import { ParamsService, PageCode } from '@common/params.service';
import { MenuService } from '@common/menu.service';
import { MixesRestService } from '@rest/mixes';

import { OverviewService } from './overview.service';

@Component({
	templateUrl: './overview.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		MixesRestService
	]
})

export class OverviewComponent implements OnDestroy {
	private sub: Subscription;
	private menu: any;

	queries: any = null;
	items: any = [];

	mixesTotal = 0;
	isLoadingMore = false;
	loading = false;

	queriesMap = new Map<string, string[]>();
	pageTitle = '';
	pageDescription = '';

	constructor(
		private router: Router,
		private cd: ChangeDetectorRef,
		private overviewService: OverviewService,
		private paramsService: ParamsService,
		private mixesRestService: MixesRestService,
		private menuService: MenuService,
		route: ActivatedRoute
	) {
		this.paramsService.setRelatedPage(PageCode.Mixes);
		this.defineQueries();

		this.sub = combineLatest(
			route.params,
			route.queryParams,
			this.menuService.get()
		)
		.subscribe(d => {
			this.defineQueries();
			this.menu = d[2];
			const params = d[0];
			const queryParams = d[1];
			this.queries.search = queryParams['search'] || '';
			this.queries.page = isNaN(+queryParams['page']) ? 0 : +queryParams['page'];

			this.overviewService.updateMetaUrl();

			this.paramsService.update(params);
			this.queriesMap = this.paramsService.getMap();

			this.patchQueries();
			this.setPageTitle();
			this.setDescription();
			this.defineMeta();
			this.fetch();
			this.cd.markForCheck();
		});
	}

	ngOnDestroy() {
		this.overviewService.resetMeta();
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	loadMore() {
		this.isLoadingMore = true;
		this.router.navigate([], {
			queryParams: {
				page: (this.queries.page || 0) + 1
			}
		});
	}

	private defineMeta() {
		this.overviewService.defineMeta(this.pageTitle, this.queries.page, this.pageDescription);
	}

	private setDescription() {
		this.pageDescription = this.overviewService.genDescription(this.queriesMap, this.menu);
	}

	private setPageTitle() {
		this.pageTitle = this.overviewService.getPageTitle(this.queriesMap, this.menu);
	}

	private defineQueries() {
		this.queries = {
			markets: [],
			companies: [],
			productLines: [],
			page: 0,
			itemsPerPage: 25,
			search: ''
		};
	}

	private patchQueries() {
		this.queriesMap.forEach((v, k) => {
			if (k === 'company') {
				this.queries.companies = v;
			}
			if (k === 'unit-line') {
				this.queries.lines = v;
			}
		});
	}

	private fetch() {
		this.loading = true;
		const queries = {
			company: this.queries.companies,
			line: this.queries.lines || [],
			page: this.queries.page,
			itemsPerPage: this.queries.itemsPerPage,
			search: this.queries.search || ''
		};

		this.mixesRestService.list(queries)
			.subscribe(d => {
				if (this.isLoadingMore) {
					this.items = this.items.concat(d.items);
				} else {
					this.items = d.items;
				}
				this.mixesTotal = d.total;
				this.loading = false;
				this.isLoadingMore = false;
				this.cd.markForCheck();
			});
	}
}
