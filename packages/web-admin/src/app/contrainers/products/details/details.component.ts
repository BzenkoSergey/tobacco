import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { CompanyDto, CompaniesRestService } from '@rest/companies';
import { CategoryDto, CategoriesRestService } from '@rest/categories';
import { ProductDto, ProductsRestService } from '@rest/products';
import { ProductAttributeDto, ProductAttributesRestService } from '@rest/product-attributes';
import { ProductLineDto, ProductLinesRestService } from '@rest/product-lines';
import { MarketProductDto, MarketProductsRestService } from '@rest/market-products';
import { MarketDto, MarketsRestService } from '@rest/markets';

@Component({
	templateUrl: './details.html',
	styleUrls: ['./details.scss'],
	providers: [
		ProductsRestService,
		CompaniesRestService,
		CategoriesRestService,
		ProductAttributesRestService,
		ProductLinesRestService,
		MarketProductsRestService,
		MarketsRestService
	]
})

export class DetailsComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	categories: CategoryDto[] = [];
	companies: CompanyDto[] = [];
	productLines: ProductLineDto[] = [];
	productAttributes: ProductAttributeDto[] = [];
	marketProducts: MarketProductDto[] = [];
	markets: MarketDto[] = [];

	loading = false;
	item = new ProductDto();

	constructor(
		private service: ProductsRestService,
		private companiesService: CompaniesRestService,
		private categoriesService: CategoriesRestService,
		private productAttributesService: ProductAttributesRestService,
		private productLinesService: ProductLinesRestService,
		private marketProductsService: MarketProductsRestService,
		private marketsService: MarketsRestService,
		route: ActivatedRoute
	) {
		this.fetchCategories();
		this.fetchCompanies();
		this.fetchProductLines();
		this.fetchProductAttributes();
		this.fetchMarkets();

		this.sub = route.params.subscribe(params => {
			this.itemId = params.companyId;
			this.fetch();
			this.fetchMarketProducts();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	save() {
		this.loading = true;
		this.service.update(this.item)
			.subscribe(
				d => {
					this.loading = false;
					this.item = d;
				},
				e => this.loading = false
			);
	}

	getMarket(id: string) {
		return this.markets.find(p => p._id.$oid === id);
	}

	fetchMarkets() {
		this.marketsService.list()
			.subscribe(d => this.markets = d);
	}

	private fetchMarketProducts() {
		this.marketProductsService
			.list({
				product: this.itemId
			})
			.subscribe(d => this.marketProducts = d);
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

	private fetchProductAttributes() {
		this.productAttributesService.list()
			.subscribe(d => this.productAttributes = d);
	}

	private fetch() {
		this.loading = true;
		this.service.get(this.itemId)
			.subscribe(
				d => {
					this.loading = false;
					this.item = d;
				},
				e => this.loading = false
			);
	}
}
