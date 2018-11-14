import { Component } from '@angular/core';

import { Subject, combineLatest } from 'rxjs';

import { ProductSearchDto, ProductsSearchRestService } from '@rest/products-search';
import { ProductsRestService, ProductDto } from '@rest/products';
import { CompanyDto, CompaniesRestService } from '@rest/companies';
import { CategoryDto, CategoriesRestService } from '@rest/categories';
import { ProductLineDto, ProductLinesRestService } from '@rest/product-lines';

@Component({
	templateUrl: './products-search.html',
	styleUrls: ['./products-search.scss'],
	providers: [
		ProductsSearchRestService,
		ProductsRestService,
		CompaniesRestService,
		CategoriesRestService,
		ProductLinesRestService
	]
})

export class ProductsSearchComponent {
	map = new Map<string, string>();

	search: ProductSearchDto[] = [];
	products: ProductDto[] = [];
	categories: CategoryDto[] = [];
	companies: CompanyDto[] = [];
	productLines: ProductLineDto[] = [];

	constructor(
		private service: ProductsSearchRestService,
		private productsRestService: ProductsRestService,
		private companiesService: CompaniesRestService,
		private categoriesService: CategoriesRestService,
		private productLinesService: ProductLinesRestService
	) {
		this.fetch();
	}

	update() {
		this.map.forEach((searchLine: string, productId: string) => {
			let search = this.search.find(s => s.product === productId);
			if (search) {
				if (search.query === searchLine) {
					return;
				}
				search.query = searchLine;
				this.service.update(search);
				return;
			}
			search = new ProductSearchDto();
			search.product = productId;
			search.query = searchLine;
			this.service.create(search);
		});
	}

	processProducts(products: ProductDto[]) {
		products.forEach(p => {
			const searchLine = this.generateSearchLine(p);
			this.map.set(p._id.$oid, searchLine);
		});
	}

	generateSearchLine(product: ProductDto) {
		const company = this.getCompany(product.company);
		const categories = this.getCategories(product.categories);
		const productLine = this.getProductLine(product.productLine);
		let searchLine: string[] = [];
		if (categories.length) {
			searchLine = categories.map(c => c.name);
		}
		if (company) {
			searchLine.push(company.name);
		}
		if (productLine) {
			searchLine.push(productLine.name);
		}
		searchLine.push(product.name);
		return searchLine.join(' ');
	}

	getSearch(productId: string) {
		return this.search.find(p => p.product === productId);
	}

	getSearchName(productId: string) {
		const search = this.getSearch(productId);
		return search ? search.query : '';
	}

	getCompany(companyId: string) {
		return this.companies.find(p => p._id.$oid === companyId);
	}

	getCategories(categoriesIds: string[]) {
		return this.categories.filter(p => categoriesIds.includes(p._id.$oid));
	}

	getProductLine(productLineId: string) {
		return this.productLines.find(p => p._id.$oid === productLineId);
	}

	// update(d: CategoryDto) {
	// 	this.service.update(d)
	// 		.subscribe(r => {
	// 			this.fetch();
	// 			this.setPlaceholder(r);
	// 			console.log(r);
	// 		});
	// }

	// save(d: CategoryDto) {
	// 	if (d._id) {
	// 		this.update(d);
	// 		return;
	// 	}
	// 	this.create(d);
	// }

	private fetch() {
		combineLatest(
			this.fetchProducts(),
			this.fetchSearch(),
			this.fetchCategories(),
			this.fetchCompanies(),
			this.fetchProductLines()
		)
		.subscribe(d => {
			this.products = d[0];
			this.search = d[1];
			this.categories = d[2];
			this.companies = d[3];
			this.productLines = d[4];
			this.processProducts(this.products);
		});
	}

	private fetchSearch() {
		return this.service.list();
	}

	private fetchProducts() {
		return this.productsRestService.list();
	}

	private fetchCategories() {
		return this.categoriesService.list();
	}

	private fetchCompanies() {
		return this.companiesService.list();
	}

	private fetchProductLines() {
		return this.productLinesService.list();
	}
}
