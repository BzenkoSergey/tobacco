import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, Observable, combineLatest } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { UnitsRestService, UnitDto } from '@rest/units';
import { UnitLinesRestService, UnitLineDto } from '@rest/unit-lines';
import { UnitItemsRestService, UnitItemDto } from '@rest/unit-items';
import { ResourcesRestService, ResourceDto } from '@rest/resources';
import { CompaniesRestService, CompanyDto } from '@rest/companies';
import { ResourcesProcessedItemsRestService } from '@rest/resources-processed-items';
import { SchemeProcessesRestService } from '@rest/scheme-processes';
import { SchemesRestService } from '@rest/schemes';
import { PipeRestService } from '@rest/pipes';

import { UnitsItemsService } from './units-items.service';

@Component({
	templateUrl: './units-items.html',
	styleUrls: ['./units-items.scss'],
	providers: [
		UnitsRestService,
		CompaniesRestService,
		ResourcesRestService,
		UnitLinesRestService,
		UnitItemsRestService,
		ResourcesProcessedItemsRestService,
		SchemeProcessesRestService,
		SchemesRestService,
		PipeRestService
	]
})

export class UnitsItemsComponent implements OnDestroy {
	private sub: Subscription;
	units: UnitDto[] = [];
	items: UnitDto[] = [];
	lines: UnitLineDto[] = [];

	syncItems: string[] = [];

	searchQuery: string;
	company: string;
	companies: CompanyDto[] = [];
	item: UnitDto;
	processedItems: any[] = [];
	resources: ResourceDto[] = [];
	resource = '';
	sortBy = '';
	sortDirection = 'up';
	hasUpdates: number = null;
	page = 1;
	perPage = 30;
	total = 0;

	constructor(
		private router: Router,
		private service: UnitsRestService,
		private resourcesRestService: ResourcesRestService,
		private companiesService: CompaniesRestService,
		private unitLinesService: UnitLinesRestService,
		private unitItemsService: UnitItemsRestService,
		private schemeProcessesService: SchemeProcessesRestService,
		private processedItemsRestService: ResourcesProcessedItemsRestService,
		private schemesRestService: SchemesRestService,
		private pipesService: PipeRestService,
		route: ActivatedRoute
	) {
		this.fetchResources();
		this.fetchCompanies();
		this.fetchLines();
		this.sub = route.queryParams.subscribe(p => {
			if (!isNaN(+p.hasUpdates)) {
				this.hasUpdates = +p.hasUpdates;
			}
			this.page = isNaN(+p.page) ? 1 : +p.page;
			this.perPage = isNaN(+p.perPage) ? 30 : +p.perPage;
			this.searchQuery = p.search;
			this.company = p.company;
			this.resource = p.resource;
			this.sortBy = p.sortBy;
			this.sortDirection = p.sortDirection || 'up';
			this.fetchProcessedItems();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	applyFilters() {
		console.log('applyFilters');
		this.router.navigate([], {
			queryParams: {
				search: this.searchQuery,
				company: this.company,
				resource: this.resource,
				sortBy: this.sortBy,
				page: this.page,
				perPage: this.perPage,
				sortDirection: this.sortDirection,
				hasUpdates: this.hasUpdates
			},
			queryParamsHandling: 'merge'
		});
	}

	getProps(item: any) {
		return Object.keys(item)
			.filter(p => {
				return ![
					'_id',
					'companyId',
					'productId',
					'scheme',
					'version',
					'productLineId',
					'structureCode',
					'resource',
					'processedQuality'
				].includes(p);
			});
	}

	getValue(item: any, prop: string) {
		const value = item[prop];
		if (typeof value === 'object') {
			return JSON.stringify(value);
		}
		return item[prop];
	}

	selectCompany(companyId: string) {
		this.router.navigate([], {
			queryParams: {
				company: companyId
			},
			queryParamsHandling: 'merge'
		});
	}

	select(d: UnitDto) {
		this.item = d;
		if (d._id) {
			this.router.navigate([], {
				queryParams: {
					itemId: d._id
				},
				queryParamsHandling: 'merge'
			});
		}
	}

	getUnit(unitId: string) {
		if (!unitId) {
			return null;
		}
		return this.units.find(u => u._id === unitId);
	}

	getLine(lineId: string) {
		if (!lineId) {
			return null;
		}
		return this.lines.find(u => u._id === lineId);
	}

	getCompany(companyId: string) {
		if (!companyId) {
			return null;
		}
		return this.companies.find(u => u._id === companyId);
	}

	assign(item: any) {
		const dto = new UnitItemDto();
		dto.itemProcessedId = item.item._id;
		this.unitItemsService.create(dto)
			.subscribe(d => {
				this.fetchProcessedItems();
				this.aggregate(item.item.productId);
			});
	}

	setAutoSync(item: any) {
		item.unitItem.autoAggregation = !item.unitItem.autoAggregation;
		this.unitItemsService.update(item.unitItem._id, item.unitItem)
			.subscribe(() => {
				this.fetchProcessedItems();
			});
	}

	unassign(item: any) {
		this.unitItemsService.remove(item.unitItem._id)
			.subscribe(d => {
				this.fetchProcessedItems();
				this.aggregate(item.item.productId);
			});
	}

	update(item: any) {
		item.unitItem.itemProcessedId = item.item._id;
		this.unitItemsService.update(item.unitItem._id, item.unitItem)
			.subscribe(d => {
				this.fetchProcessedItems();
				this.aggregate(item.item.productId);
			});
	}

	aggregate(unitId: string) {
		this.pipesService.runSchemeOptions<any, any>(
			'PRODUCT_AGGREGATE',
			{
				data: {
					productId: unitId
				}
			}
		).subscribe();
	}

	isSync(url: string) {
		return this.syncItems.includes(url);
	}

	syncPage() {
		const subjs = this.processedItems.map(item => {
			this.syncItems.push(item.item.url);
			return this.resourcesRestService.get(item.item.resource)
				.pipe(
					mergeMap(resource => {
						return this.schemesRestService
							.list({
								_id: {
									$in: resource.schemes.map(i => '$' + i),
								},
								code: 'PRODUCT_FETCH'
							})
							.pipe(
								mergeMap(schemes => {
									const scheme = schemes[0];
									return this.schemeProcessesService.createWithData(scheme._id, item.item.url)
										.pipe(
											map(() => {
												this.syncItems = this.syncItems.filter(i => i !== item.item.url);
												return null;
											})
										);
								})
							);
					})
				);
		});

		combineLatest(...subjs)
			.subscribe(() => {
				this.fetchProcessedItems();
			});
	}

	sync(item: any) {
		this.syncItems.push(item.item.url);
		this.resourcesRestService.get(item.item.resource)
			.subscribe(resource => {
				this.schemesRestService
					.list({
						_id: {
							$in: resource.schemes.map(i => '$' + i),
						},
						code: 'PRODUCT_FETCH'
					})
					.subscribe(schemes => {
						const scheme = schemes[0];
						this.schemeProcessesService.createWithData(scheme._id, item.item.url)
							.subscribe(() => {
								this.fetchProcessedItems();
								this.syncItems = this.syncItems.filter(i => i !== item.item.url);
							});
					});
			});
	}

	private fetchCompanies() {
		this.companiesService.list()
			.subscribe(d => {
				this.companies = d;
			});
	}

	isUpdated(item: any, items: any[], prop: string) {
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

	private fetchUnits(ids: string[]) {
		const query = {
			_id: {
				$in: ids
			}
		};

		this.service.list(query)
			.subscribe(d => {
				this.units = d.concat([]);
				this.items = d;
			});
	}

	private getQuery() {
		const r = UnitsItemsService.fetchProcessedItems();
		if (this.company || this.searchQuery || this.resource || this.sortBy || this.sortDirection) {
			const query: any = {};
			if (this.searchQuery) {
				query.title = {
					$regex: this.searchQuery,
					$options: 'ig'
				};
			}
			if (this.company) {
				query.companyId = this.company;
			}
			if (this.resource) {
				query.resource = this.resource;
			}
			r.unshift({
				$match: query
			});

			if (this.sortBy) {
				const s: any = { $sort: {}};
				if (this.sortBy === 'assigned') {
					s.$sort[this.sortBy] = this.sortDirection === 'down' ? 1 : -1;
				} else {
					s.$sort['item.' + this.sortBy] = this.sortDirection === 'down' ? 1 : -1;
				}
				r.push(s);
			} else {
				// r.push({
				// 	$sort: {
				// 		'item.version': -1
				// 	}
				// });
			}

			if (typeof this.hasUpdates === 'number') {
				r.push({
					$match: {
						hasUpdates: !!this.hasUpdates
					}
				});
			}
		}
		return r;
	}

	private fetchProcessedItems() {
		const r = this.getQuery();
		r.push({
			$count: 'total'
		});
		const r2 = this.getQuery();
		r2.push({
			$skip : this.perPage * (this.page - 1)
		});
		r2.push({
			$limit: this.perPage
		});
		combineLatest(
			this.processedItemsRestService.aggregate(r),
			this.processedItemsRestService.aggregate(r2)
		)
		.subscribe(d => {
			this.total = d[0][0]? d[0][0].total : 0;
			this.processedItems = d[1];
			const unitsIds = d[1]
				.filter(i => i.item.productId)
				.map(i => '$' + i.item.productId);
			this.fetchUnits(unitsIds);
		});
	}

	private fetchResources() {
		this.resourcesRestService.list()
			.subscribe(d => this.resources = d);
	}

	private fetchLines() {
		this.unitLinesService.list()
			.subscribe(d => {
				this.lines = d;
			});
	}
}
