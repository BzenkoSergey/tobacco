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

@Component({
	templateUrl: './wiki.html',
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

		WikiRestService
	]
})

export class WikiComponent implements OnDestroy {
	private sub: Subscription;

	searchQuery: string;
	items: WikiDto[] = [];
	item: WikiDto;

	constructor(
		private service: WikiRestService,
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
		query = query || {};
		if (this.searchQuery) {
			query.name = {
				$regex: this.searchQuery,
				$options: 'ig'
			};
		}

		const sort = {
			productLine: 1
		};

		const sub = this.service.list(query, null, null, sort);
		sub.subscribe(d => {
			this.items = d;
		});
	}
}
