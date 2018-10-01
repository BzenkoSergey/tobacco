import { Component } from '@angular/core';

import { MarketProductDto, MarketProductsRestService } from '@rest/market-products';
import { ProductDto, ProductsRestService } from '@rest/products';
import { MarketDto, MarketsRestService } from '@rest/markets';

@Component({
	templateUrl: './market-products.html',
	styleUrls: ['./market-products.scss'],
	providers: [
		MarketProductsRestService,
		ProductsRestService,
		MarketsRestService
	]
})
export class MarketProductsComponent {
	items: MarketProductDto[] = [];
	products: ProductDto[] = [];
	markets: MarketDto[] = [];

	constructor(
		private service: MarketProductsRestService,
		private marketsService: MarketsRestService,
		private productsService: ProductsRestService
	) {
		this.fetch();
		this.fetchProducts();
		this.fetchMarkets();
	}

	getItems(productId: string) {
		return this.items.filter(i => i.product === productId);
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
