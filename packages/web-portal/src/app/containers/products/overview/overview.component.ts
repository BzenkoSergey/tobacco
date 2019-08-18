import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, combineLatest } from 'rxjs';

import { ParamsService, PageCode } from '@common/params.service';
import { MenuService } from '@common/menu.service';
import { WikiRestService } from '@rest/wiki';

import { OverviewService } from './overview.service';

@Component({
	templateUrl: './overview.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		WikiRestService
	]
})

export class OverviewComponent implements OnDestroy {
	private sub: Subscription;
	private menu: any;
	private wiki: any[] = [];

	productsQueries: any = null;
	queries: any = null;

	productsTotal = 0;

	openedId: string|null = null;
	queriesMap = new Map<string, string[]>();
	pageTitle = '';

	hasWiki = false;
	wikiTemplates: any[] = [];

	openned = new Map<string, boolean>();

	constructor(
		private cd: ChangeDetectorRef,
		private overviewService: OverviewService,
		private paramsService: ParamsService,
		private wikiRestService: WikiRestService,
		private menuService: MenuService,
		route: ActivatedRoute,
	) {
		this.paramsService.setRelatedPage(PageCode.Products);
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
			this.openedId = null;

			this.paramsService.update(params);
			this.queriesMap = this.paramsService.getMap();

			this.patchQueries();
			this.setPageTitle();
			this.fetchWiki();
			this.setProductsQueries();
			this.cd.markForCheck();
		});
	}

	ngOnDestroy() {
		this.overviewService.resetMeta();
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	tooggleItems(id: string) {
		if (id === this.openedId) {
			this.openedId = null;
			return false;
		}
		this.openedId = id;
	}

	private setWikiTemplates() {
		if (!this.wiki.length) {
			this.wikiTemplates = [];
		}
		this.wikiTemplates = this.overviewService.getWikiTemplates(this.wiki);
		this.cd.markForCheck();
	}

	private defineQueries() {
		this.queries = {
			attributes: [],
			markets: [],
			companies: [],
			categories: [],
			productLines: [],
			productAttributes: [],
			page: 0,
			itemsPerPage: 25,
			search: ''
		};
	}

	private patchQueries() {
		this.queriesMap.forEach((v, k) => {
			if (k === 'resource') {
				this.queries.markets = v;
			}
			if (k === 'company') {
				this.queries.companies = v;
			}
			if (k === 'WEIGHT') {
				this.queries.attributes = v;
			}
			if (k === 'category') {
				this.queries.categories = v;
			}
			if (k === 'unit-line') {
				this.queries.lines = v;
			}
		});
	}

	private defineMeta() {
		this.overviewService.defineMeta(this.pageTitle, this.wiki[0], this.queries.page);
	}

	private setPageTitle() {
		this.pageTitle = this.overviewService.getPageTitle(this.queriesMap, this.menu);
	}

	private setProductsQueries() {
		this.productsQueries = {
			available: true,
			markets: this.queries.markets,
			company: this.queries.companies,
			line: this.queries.lines || [],
			categories: this.queries.categories,
			attributes: this.queries.attributes,
			page: this.queries.page,
			itemsPerPage: this.queries.itemsPerPage,
			search: this.queries.search || ''
		};
	}

	private fetchWiki() {
		const obj: any = {};
		let empty = true;
		this.queriesMap.forEach((value, key) => {
			if (value.length) {
				empty = false;
			}
			obj[key] = value;
		});
		if (empty || this.queries.page || this.queries.search) {
			this.wiki = [];
			this.hasWiki = false;
			this.setWikiTemplates();
			this.defineMeta();
			return;
		}

		this.wikiRestService.list(obj)
			.subscribe(d => {
				this.wiki = d;
				this.hasWiki = !!d.length;
				this.setWikiTemplates();
				this.defineMeta();
			});
	}
}
