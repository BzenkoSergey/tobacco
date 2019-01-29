import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, Observable, combineLatest } from 'rxjs';

import { UnitsRestService, UnitDto } from '@rest/units';
import { UnitLinesRestService, UnitLineDto } from '@rest/unit-lines';
import { UnitItemsRestService, UnitItemDto } from '@rest/unit-items';
import { ResourcesRestService, ResourceDto } from '@rest/resources';
import { CompaniesRestService, CompanyDto } from '@rest/companies';
import { ResourcesProcessedItemsRestService } from '@rest/resources-processed-items';
import { SchemeProcessesRestService } from '@rest/scheme-processes';
import { SchemesRestService } from '@rest/schemes';
import { PipeRestService } from '@rest/pipes';

import { WikiRestService, WikiDto } from '@rest/wiki';

import { ResourcesItemsRestService } from '@rest/resources-items';

@Component({
	templateUrl: './positions.html',
	// styleUrls: ['./wiki.scss'],
	providers: [
		UnitsRestService,
		CompaniesRestService,
		ResourcesRestService,
		UnitLinesRestService,
		UnitItemsRestService,
		ResourcesProcessedItemsRestService,
		SchemeProcessesRestService,
		SchemesRestService,
		PipeRestService,

		WikiRestService,

		ResourcesItemsRestService
	]
})

export class SeoPositionsComponent implements OnDestroy {
	private sub: Subscription;

	searchQuery: string;
	items: any[] = [];
	item: any;

	constructor(
		private service: ResourcesItemsRestService,
		private router: Router,
		route: ActivatedRoute
	) {
		this.sub = route.queryParams.subscribe(p => {
			this.searchQuery = p.search;
			this.fetch();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	search() {
		this.router.navigate([], {
			queryParams: {
				search: this.searchQuery
			},
			queryParamsHandling: 'merge'
		});
	}

	select(d: WikiDto) {
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

	create(d) {
		this.service.create(d)
			.subscribe(s => {
				this.fetch();
				d._id = s;
				this.select(d);
			});
	}

	remove(d) {
		this.service.remove(d._id)
			.subscribe(() => {
				this.fetch();
				this.select(null);
			});
	}

	update(d: WikiDto) {
		this.service.update(d._id, d)
			.subscribe(r => {
				this.fetch();
				this.select(d);
			});
	}

	save(d: WikiDto) {
		if (d._id) {
			this.update(d);
			return;
		}
		this.create(d);
	}

	private fetch(query?: any) {
		// query = query || {};
		// if (this.searchQuery) {
		// 	query.name = {
		// 		$regex: this.searchQuery,
		// 		$options: 'ig'
		// 	};
		// }

		// const sort = {
		// 	productLine: 1
		// };

		const sub = this.service.aggregate([
			{
				$match: {
					'resource': '5c4ddc899fd908d940443494',
					'structureCode': 'ITEM'
				}
			},
			{
				$group : {
					_id: {
						query: '$query'
					},
					itemsSold: {
						$addToSet: '$item'
					}
				}
			},
			{
				$replaceRoot: {
					newRoot: '$_id'
				}
			}
		]);
		sub.subscribe(d => {
			this.items = d;
		});
	}
}
