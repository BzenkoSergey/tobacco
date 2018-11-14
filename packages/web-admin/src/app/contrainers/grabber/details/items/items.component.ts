import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, combineLatest } from 'rxjs';

import { GrabberRestService, ResultRow, ResultItem } from '@rest/grabber';
import { GrabberMappingAttributeDto, GrabberTransform, GrabberJob } from '@magz/common';
import { MarketsRestService, MarketDto } from '@rest/markets';
import { ProductsRestService, ProductDto } from '@rest/products';
import { ProductLinesRestService, ProductLineDto } from '@rest/product-lines';
import { ProductAttributesRestService, ProductAttributeDto } from '@rest/product-attributes';
import { MarketProductsRestService, MarketProductDto } from '@rest/market-products';

import { OperationsService } from './../operations/operations.service';

@Component({
	templateUrl: './items.html',
	styleUrls: ['./items.scss'],
	providers: [
		MarketsRestService,
		ProductsRestService,
		MarketProductsRestService,
		ProductLinesRestService,
		ProductAttributesRestService,
		GrabberRestService,
		OperationsService
	]
})

export class ItemsComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	search = '';
	loading = false;
	item = new MarketDto();

	market: MarketDto;
	productAttributes: ProductAttributeDto[] = [];
	productLines: ProductLineDto[] = [];
	products: ProductDto[] = [];
	items: MarketProductDto[] = [];
	displayed: MarketProductDto[] = [];

	constructor(
		private marketsRestService: MarketsRestService,
		private grabberRestService: GrabberRestService,
		private productsRestService: ProductsRestService,
		private productLinesRestService: ProductLinesRestService,
		private productAttributesRestService: ProductAttributesRestService,
		private operationsService: OperationsService,
		private service: MarketProductsRestService,
		route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.marketId;
			this.fetch();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	performSearch() {
		if (!this.search) {
			this.displayed = this.items;
		}
		this.displayed = this.items.filter(i => {
			return !!i.label.match(new RegExp(this.search, 'i'));
		});
	}

	syncItem(item: MarketProductDto) {
		const product = this.getProduct(item);
		const job = new GrabberJob();
		job.id = this.itemId;
		job.config = this.market.grabber;
		// job.config.pageLimit = 1;
		// job.config.path = item.url.replace(job.config.host, '');
		job.config.onlyDefinedLinks = true;
		job.config.links = [item.url];
		this.grabberRestService.partiallyRun(job)
			.subscribe(r => {
				const resultItem = r[0][1][0][0];
				const d = new MarketProductDto();
				d.label = resultItem.label;
				d.available = resultItem.available;
				d.price = resultItem.price;
				d.url = resultItem.url;
				d.market = this.itemId;

				this.operationsService.fillAttributes(d, product, this.productAttributes);
			});
	}

	save() {
		// this.loading = true;
		// this.service.update(this.item)
		// 	.subscribe(
		// 		d => {
		// 			this.loading = false;
		// 			this.item = d;
		// 		},
		// 		e => this.loading = false
		// 	);
	}

	getProduct(item: MarketProductDto) {
		return this.products.find(p => p._id.$oid === item.product);
	}

	getProductLine(item: ProductDto) {
		return this.productLines.find(p => p._id.$oid === item.productLine);
	}

	private grapAll() {

		// this.grabberRestService.stream(this.itemId)
		// 	.subscribe(d => {
		// 		// this.items = d;
		// 		// this.createSnapshot(d);
		// 		// this.findProducts();
		// 	});

		// const links = this.items.map(i => i.url);
		// const job = new GrabberJob();
		// job.id = this.itemId;
		// job.config = this.market.grabber;
		// job.config.onlyDefinedLinks = true;
		// job.config.links = links;

		// this.grabberRestService.partiallyRun(job)
		// 	.subscribe(d => {
		// 		console.log(d);
		// 	});
	}

	private fetch() {
		this.loading = true;
		combineLatest(
			this.fetchMarketProducts(),
			this.fetchProducts(),
			this.fetchProductLines(),
			this.fetchMarket(),
			this.fetchProductAttributes()
		)
		.subscribe(
			d => {
				this.loading = false;
				this.items = d[0].sort((a, b) => a.label.localeCompare(b.label));
				this.displayed = this.items;
				this.products = d[1];
				this.productLines = d[2];
				this.market = d[3];
				this.productAttributes = d[4];
				this.grapAll();
			},
			e => this.loading = false
		);
	}

	private fetchProductAttributes() {
		return this.productAttributesRestService.list();
	}

	private fetchProductLines() {
		return this.productLinesRestService.list();
	}

	private fetchProducts() {
		return this.productsRestService.list();
	}

	private fetchMarketProducts() {
		return this.service.list({
			market: this.itemId
		});
	}

	private fetchMarket() {
		return this.marketsRestService.get(this.itemId);
	}
}
