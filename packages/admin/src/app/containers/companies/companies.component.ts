import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { CompaniesRestService, CompanyDto } from '@rest/companies';

@Component({
	templateUrl: './companies.html',
	providers: [
		CompaniesRestService
	]
})

export class CompaniesComponent implements OnDestroy {
	private sub: Subscription;
	companies: CompanyDto[] = [];
	items: CompanyDto[] = [];
	itemId: string;
	item: CompanyDto;

	constructor(
		private router: Router,
		private service: CompaniesRestService,
		route: ActivatedRoute
	) {
		this.fetch();
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
		const d = new CompanyDto();
		d.name = '';
		this.select(d);
	}

	select(d: CompanyDto) {
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

	update(d: CompanyDto) {
		this.service.update(d._id, d)
			.subscribe(r => {
				this.fetch();
				this.select(d);
			});
	}

	save(d: CompanyDto) {
		if (d._id) {
			this.update(d);
			return;
		}
		this.create(d);
	}

	private fetch() {
		this.service.list()
			.subscribe(d => {
				this.companies = d.concat([]);
				this.items = d;
				this.defineItem();
			});
	}

	private defineItem() {
		if (!this.itemId) {
			return;
		}
		this.item = this.companies.find(i => i._id === this.itemId);
	}
}
