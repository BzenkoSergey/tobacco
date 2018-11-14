import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material';

import { MarketProductDto, MarketProductsRestService } from '@rest/market-products';
import { ProductDto, ProductsRestService } from '@rest/products';
import { MarketDto, MarketsRestService } from '@rest/markets';

import { CompaniesRestService } from '@rest/companies';
import { CategoriesRestService } from '@rest/categories';
import { ProductLinesRestService } from '@rest/product-lines';
import { ProductAttributesRestService } from '@rest/product-attributes';

import { AggregatedProductsRestService } from '@rest/aggregated-products/aggregated-products.service';
import { AggregatedProductsService } from './../shared/aggregated-products.service';

@Component({
	templateUrl: './market-products.html',
	styleUrls: ['./market-products.scss'],
	providers: [
		MarketProductsRestService,
		ProductsRestService,
		MarketsRestService,

		CompaniesRestService,
		CategoriesRestService,
		ProductLinesRestService,
		ProductAttributesRestService,
		AggregatedProductsRestService,
		AggregatedProductsService
	]
})
export class MarketProductsComponent {
	items: MarketProductDto[] = [];
	products: ProductDto[] = [];
	markets: MarketDto[] = [];

	pageSize = 10;
	page = 0;

	start = 0;
	end = 10;

	constructor(
		private router: Router,
		private service: MarketProductsRestService,
		private marketsService: MarketsRestService,
		private productsService: ProductsRestService,
		private aggregatedProductsService: AggregatedProductsService,
		route: ActivatedRoute
	) {
		route.queryParams.subscribe(p => {
			this.page = +(p.page || 0);
			this.pageSize = +(p.pageSize || 10);
			this.start = this.page * this.pageSize;
			this.end = this.start + this.pageSize;
		});
		this.fetch();
		this.fetchProducts();
		this.fetchMarkets();
	}

	remove(d: MarketProductDto) {
		this.service.remove(d)
			.subscribe(() => {
				this.fetch();
				this.aggregatedProductsService.aggregate(d.product);
			});
	}

	setPage(e: PageEvent) {
		this.router.navigate([], {
			queryParams: {
				page: e.pageIndex,
				pageSize: e.pageSize
			},
			queryParamsHandling: 'merge'
		});
	}

	getItems(productId: string) {
		return this.items
			.filter(i => i.product === productId)
			.sort((a, b) => {
				return a.market.localeCompare(b.market);
			});
	}

	getProduct(id: string) {
		return this.products.find(p => p._id.$oid === id);
	}

	getMarket(id: string) {
		return this.markets.find(p => p._id.$oid === id);
	}

	fetchMarkets() {
		this.marketsService.list()
			.subscribe(d => this.markets = d);
	}

	private fetchProducts() {
		this.productsService.list()
			.subscribe(d => this.products = d);
	}

	private fetch() {
		this.service.list()
			.subscribe(d => this.items = d);
	}
}
