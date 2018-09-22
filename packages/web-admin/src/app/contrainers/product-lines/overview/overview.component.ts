import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';

import { ProductLineDto, ProductLinesRestService } from '@rest/product-lines';
import { CompaniesRestService, CompanyDto } from '@rest/companies';

@Component({
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [
		CompaniesRestService,
		ProductLinesRestService
	]
})

export class OverviewComponent {
	map = new Map<CompanyDto, ProductLineDto[]>();
	items: ProductLineDto[] = [];
	companies: CompanyDto[] = [];

	constructor(
		private companiesService: CompaniesRestService,
		private router: Router,
		private route: ActivatedRoute,
		private service: ProductLinesRestService
	) {
		this.fetchCompanies()
			.subscribe(() => {
				this.fetch();
			});
	}

	create() {
		const item = new ProductLineDto();
		item.name = 'Placeholder';

		this.service.create(item)
			.subscribe(d => {
				this.router.navigate(['./../../', d._id.$oid], {
					relativeTo: this.route
				});
			});
	}

	private buildList() {
		this.companies.forEach(c => {
			const productLines = this.items.filter(p => p.company === c._id.$oid);
			this.map.set(c, productLines);
		});
		const unassigned = this.items.filter(p => !p.company);
		this.map.set(null, unassigned);
	}

	private fetch() {
		this.service.list()
			.subscribe(list => {
				this.items = list;
				this.buildList();
			});
	}

	private fetchCompanies() {
		const subj = new Subject();
		this.companiesService.list()
			.subscribe(
				list => {
					this.companies = list;
					subj.next();
				},
				e => subj.error(e),
				() => subj.complete()
			);
		return subj;
	}
}
