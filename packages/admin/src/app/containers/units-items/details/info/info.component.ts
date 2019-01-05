import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { CompaniesRestService, CompanyDto } from '@rest/companies';
import { CategoriesRestService, CategoryDto } from '@rest/categories';
import { UnitLinesRestService, UnitLineDto } from '@rest/unit-lines';
import { UnitAttributesRestService, UnitAttributeDto } from '@rest/unit-attributes';
import { UnitsRestService, UnitDto } from '@rest/units';

@Component({
	templateUrl: './info.html',
	providers: [
		UnitsRestService,
		UnitLinesRestService,
		UnitAttributesRestService,
		CompaniesRestService,
		CategoriesRestService
	]
})

export class UnitsDetailsInfoComponent implements OnDestroy {
	private sub: Subscription;

	itemId: string;
	categories: CategoryDto[] = [];
	companies: CompanyDto[] = [];
	lines: UnitLineDto[] = [];
	attributes: UnitAttributeDto[] = [];

	item = new UnitDto();
	loading = false;

	constructor(
		private linesService: UnitLinesRestService,
		private attrsService: UnitAttributesRestService,
		private companiesService: CompaniesRestService,
		private categoriesService: CategoriesRestService,
		private service: UnitsRestService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.unitId;
			if (this.itemId !== 'new') {
				this.fetch();
			} else {
				this.item = new UnitDto();
			}
		});
		this.fetchCategories();
		this.fetchAttributes();
		this.fetchCompanies();
		this.fetchLines();
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	getLine(company: CompanyDto) {
		return this.lines.filter(p => p.company === company._id);
	}

	filterBySelected(companyId: string) {
		return this.companies.filter(c => c._id === companyId);
	}

	remove() {
		this.service.remove(this.itemId)
			.subscribe(() => {
				this.router.navigate(['../../../../'], {
					relativeTo: this.route,
					queryParamsHandling: 'merge'
				});
			});
	}

	save(invalid: boolean) {
		if (invalid) {
			return;
		}
		this.loading = true;
		if (!this.item._id) {
			this.service.create(this.item)
				.subscribe(
					(unitId) => {
						this.loading = false;
						this.router.navigate(['../../../../', unitId], {
							relativeTo: this.route,
							queryParamsHandling: 'merge'
						});
					},
					() => this.loading = false
				);
			return;
		}
		this.service.update(this.itemId, this.item)
			.subscribe(
				() => this.loading = false,
				() => this.loading = false
			);
	}

	private fetch() {
		this.loading = true;
		this.service.get(this.itemId)
			.subscribe(
				d => {
					this.item = d;
					this.loading = false;
				},
				() => this.loading = false
			);
	}

	private fetchCategories() {
		this.categoriesService.list()
			.subscribe(d => this.categories = d);
	}

	private fetchCompanies() {
		this.companiesService.list()
			.subscribe(d => this.companies = d);
	}

	private fetchLines() {
		this.linesService.list()
			.subscribe(d => this.lines = d);
	}

	private fetchAttributes() {
		this.attrsService.list()
			.subscribe(d => this.attributes = d);
	}
}
