import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, Observable } from 'rxjs';

import { UnitsRestService, UnitDto } from '@rest/units';
import { UnitLinesRestService, UnitLineDto } from '@rest/unit-lines';
import { CompaniesRestService, CompanyDto } from '@rest/companies';

@Component({
	templateUrl: './units.html',
	styleUrls: ['./units.scss'],
	providers: [
		UnitsRestService,
		CompaniesRestService,
		UnitLinesRestService
	]
})

export class UnitsComponent implements OnDestroy {
	private sub: Subscription;
	units: UnitDto[] = [];
	items: UnitDto[] = [];
	searchQuery: string;
	company: string;
	companies: CompanyDto[] = [];
	lines: UnitLineDto[] = [];
	item: UnitDto;

	constructor(
		private router: Router,
		private service: UnitsRestService,
		private companiesService: CompaniesRestService,
		private linesRestService: UnitLinesRestService,
		route: ActivatedRoute
	) {
		this.fetchCompanies();
		this.fetchLines();
		this.sub = route.queryParams.subscribe(p => {
			this.searchQuery = p.search;
			this.company = p.company;
			this.fetch();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	getImageUrl(item: UnitDto) {
		let url = item.logo;
		if (!url) {
			return '';
		}
		if (url.includes('http')) {
			url = 'http://' + window.location.hostname + ':3330/scheme/code/IMG_EXTERNAL_DOWNLOAD/options?loadImage=true&path=' + url;
		} else {
			url = 'http://' + window.location.hostname + ':3330/scheme/code/IMG_DOWMLOAD/options?path=' + item.logo + '&isFile=true';
		}
		return url;
	}

	getLine(lineId: string) {
		return this.lines.find(l => l._id === lineId);
	}

	search() {
		this.router.navigate([], {
			queryParams: {
				search: this.searchQuery
			},
			queryParamsHandling: 'merge'
		});
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

	update(d: UnitDto) {
		this.service.update(d._id, d)
			.subscribe(r => {
				this.fetch();
				this.select(d);
			});
	}

	save(d: UnitDto) {
		if (d._id) {
			this.update(d);
			return;
		}
		this.create(d);
	}

	private fetchLines() {
		this.linesRestService.list()
			.subscribe(d => {
				this.lines = d;
			});
	}

	private fetchCompanies() {
		this.companiesService.list()
			.subscribe(d => {
				this.companies = d;
			});
	}

	private fetch(query?: any) {
		query = query || {};
		if (this.searchQuery) {
			query.name = {
				$regex: this.searchQuery,
				$options: 'ig'
			};
		}

		let sub: Observable<UnitDto[]>;
		const sort = {
			productLine: 1
		};

		if (this.company) {
			query.company = this.company;
			sub = this.service.list(query, null, null, sort);
		} else {
			sub = this.service.list(query || {}, 50, null, sort);
		}

		sub.subscribe(d => {
			this.units = d.concat([]);
			this.items = d;
		});
	}
}
