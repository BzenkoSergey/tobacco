import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, combineLatest } from 'rxjs';

import { UnitLinesRestService, UnitLineDto } from '@rest/unit-lines';
import { CompaniesRestService, CompanyDto } from '@rest/companies';

@Component({
	templateUrl: './unit-lines.html',
	providers: [
		UnitLinesRestService,
		CompaniesRestService
	]
})

export class UnitLinesComponent implements OnDestroy {
	private sub: Subscription;

	map = new Map<CompanyDto, UnitLineDto[]>();
	companies: CompanyDto[] = [];
	items: CompanyDto[] = [];
	lines: UnitLineDto[] = [];
	itemId: string;
	item: UnitLineDto;

	constructor(
		private router: Router,
		private companiesRestService: CompaniesRestService,
		private service: UnitLinesRestService,
		route: ActivatedRoute
	) {
		this.fetchAll();
		this.sub = route.queryParams.subscribe(p => {
			this.itemId = p.itemId;
			this.defineItem();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	search(query?: string) {
		if (!query) {
			this.items = this.companies;
			return;
		}
		this.items = this.companies.filter(c => {
			return new RegExp(query, 'ig').test(c.name);
		});
	}

	createItem() {
		const d = new UnitLineDto();
		d.name = '';
		this.select(d);
	}

	select(d: UnitLineDto) {
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

	update(d: UnitLineDto) {
		this.service.update(d._id, d)
			.subscribe(r => {
				this.fetch();
				this.select(d);
			});
	}

	save(d: UnitLineDto) {
		if (d._id) {
			this.update(d);
			return;
		}
		this.create(d);
	}

	private buildList() {
		this.companies.forEach(c => {
			const lines = this.lines.filter(p => p.company === c._id);
			this.map.set(c, lines);
		});
		const unassigned = this.lines.filter(p => !p.company);
		this.map.set(null, unassigned);
	}

	private fetchAll() {
		combineLatest(
			this.fetchCompanies(),
			this.fetch()
		)
		.subscribe(d => {
			this.companies = d[0].concat([]);
			this.items = d[0];

			this.lines = d[1];
			this.buildList();
			this.defineItem();
		});
	}

	private fetchCompanies() {
		return this.companiesRestService.list();
	}

	private fetch() {
		return this.service.list();
	}

	private defineItem() {
		if (!this.itemId) {
			return;
		}
		this.item = this.lines.find(i => i._id === this.itemId);
	}
}
