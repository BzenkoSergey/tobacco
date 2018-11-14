import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductDto, ProductsRestService } from '@rest/products';
import { CompanyDto, CompaniesRestService } from '@rest/companies';
import { CategoryDto, CategoriesRestService } from '@rest/categories';
import { ProductLineDto, ProductLinesRestService } from '@rest/product-lines';

import { ProductAttributesRestService } from '@rest/product-attributes';
import { MarketsRestService } from '@rest/markets';
import { MarketProductsRestService } from '@rest/market-products';

import { AggregatedProductsRestService } from '@rest/aggregated-products/aggregated-products.service';
import { AggregatedProductsService } from './../../shared/aggregated-products.service';

@Component({
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [
		ProductsRestService,
		CompaniesRestService,
		CategoriesRestService,
		ProductLinesRestService,

		MarketProductsRestService,
		MarketsRestService,
		ProductAttributesRestService,
		AggregatedProductsRestService,
		AggregatedProductsService
	]
})

export class OverviewComponent {
	items: ProductDto[] = [];
	companyId: string;

	categories: CategoryDto[] = [];
	companies: CompanyDto[] = [];
	productLines: ProductLineDto[] = [];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: ProductsRestService,
		private companiesService: CompaniesRestService,
		private categoriesService: CategoriesRestService,
		private productLinesService: ProductLinesRestService,
		private aggregatedProductsService: AggregatedProductsService
	) {
		route.queryParams.subscribe(p => {
			this.companyId = p.companyId;
			this.fetch();
		});
		this.fetchCategories();
		this.fetchCompanies();
		this.fetchProductLines();
		// this.fetch();
	}

	aggregateAll() {
		this.items.forEach(i => {
			this.aggregatedProductsService.aggregate(i._id.$oid);
		});
	}

	selectCompany(companyId: string) {
		this.router.navigate([], {
			queryParams: {
				companyId: companyId
			}
		});
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
				this.aggregatedProductsService.remove(d._id.$oid);
			});
	}

	create() {
		const item = new ProductDto();
		item.name = '';
		if (this.companyId) {
			item.company = this.companyId;
		}

		this.service.create(item)
			.subscribe(d => {
				this.router.navigate(['./../../', d._id.$oid], {
					relativeTo: this.route,
					queryParams: {
						companyId: this.companyId
					}
				});
			});
	}

	fetch() {
		const query: any = {};
		if (this.companyId) {
			query.company = this.companyId;
		}

		this.service
			.list(query)
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
