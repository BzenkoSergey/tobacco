import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductDto, ProductsRestService } from '@rest/products';
import { CompanyDto, CompaniesRestService } from '@rest/companies';
import { CategoryDto, CategoriesRestService } from '@rest/categories';
import { ProductLineDto, ProductLinesRestService } from '@rest/product-lines';

@Component({
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [
		ProductsRestService,
		CompaniesRestService,
		CategoriesRestService,
		ProductLinesRestService
	]
})

export class OverviewComponent {
	items: ProductDto[] = [];

	categories: CategoryDto[] = [];
	companies: CompanyDto[] = [];
	productLines: ProductLineDto[] = [];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: ProductsRestService,
		private companiesService: CompaniesRestService,
		private categoriesService: CategoriesRestService,
		private productLinesService: ProductLinesRestService
	) {
		this.fetchCategories();
		this.fetchCompanies();
		this.fetchProductLines();
		this.fetch();
	}

	getProductLineName(id: string) {
		const d = this.productLines.find(l => l._id.$oid === id);
		return d ? d.name : 'Missing';
	}

	getCompanyName(id: string) {
		const d = this.companies.find(l => l._id.$oid === id);
		return d ? d.name : 'Missing';
	}

	getCategoriesNames(ids: string) {
		const d = this.categories.filter(l => ids.includes(l._id.$oid));
		return d
			.map(s => s.name)
			.join(', ');
	}

	remove(d: ProductDto) {
		this.service.remove(d)
			.subscribe(s => {
				this.fetch();
			});
	}

	create() {
		const item = new ProductDto();
		item.name = 'Placeholder';

		this.service.create(item)
			.subscribe(d => {
				this.router.navigate(['./../../', d._id.$oid], {
					relativeTo: this.route
				});
			});
	}

	fetch() {
		this.service.list()
			.subscribe(list => {
				this.items = list;
			});
	}

	private fetchCategories() {
		this.categoriesService.list()
			.subscribe(d => this.categories = d);
	}

	private fetchCompanies() {
		this.companiesService.list()
			.subscribe(d => this.companies = d);
	}

	private fetchProductLines() {
		this.productLinesService.list()
			.subscribe(d => this.productLines = d);
	}
}
