import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { MarketsRestService, MarketDto } from '@rest/markets';
import { GrabberRestService, ResultRow, ResultItem } from '@rest/grabber';
import { ProductDto, ProductsRestService } from '@rest/products';
import { CompanyDto, CompaniesRestService } from '@rest/companies';
import { ProductAttributeDto, ProductAttributesRestService } from '@rest/product-attributes';
import { MarketProductDto, MarketProductsRestService } from '@rest/market-products';

import { OperationsService } from './operations.service';

@Component({
	templateUrl: './operations.html',
	styleUrls: ['./operations.scss'],
	providers: [
		OperationsService,
		MarketsRestService,
		GrabberRestService,
		ProductsRestService,
		CompaniesRestService,
		ProductAttributesRestService,
		MarketProductsRestService
	]
})

export class OperationsComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	private products: ProductDto[] = [];
	private companies: CompanyDto[] = [];
	private productAttributes: ProductAttributeDto[] = [];
	private marketProducts: MarketProductDto[] = [];

	loading = false;
	item = new MarketDto();
	snapshot: MarketProductDto[] = [];
	map = new Map<MarketProductDto, MarketProductDto>();

	constructor(
		private service: MarketsRestService,
		private marketProductsService: MarketProductsRestService,
		private productAttributesService: ProductAttributesRestService,
		private companiesService: CompaniesRestService,
		private productsService: ProductsRestService,
		private grabberService: GrabberRestService,
		private operationsService: OperationsService,
		route: ActivatedRoute
	) {
		this.fetchProducts();
		this.fetchProductAttributes();
		this.fetchCompanies();
		this.fetchMarketProducts();

		this.sub = route.params.subscribe(params => {
			this.itemId = params.marketId;
			this.fetch();
			const json = window.localStorage.getItem('grabber-snapshot');
			if (json) {
				this.snapshot = JSON.parse(json);
			}
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	getChanges(grabbed: MarketProductDto) {
		const existing = this.map.get(grabbed);
		if (!existing) {
			return {};
		}
		return this.operationsService.getChanges(grabbed, existing);
	}

	saveItems() {
		this.snapshot
			.filter(i => i.product)
			.forEach(i => {
				const exists = this.map.get(i);
				if (!exists) {
					this.createMarketProduct(i);
					return;
				}
				this.updateMarketProduct(i, exists);
			});
	}

	findProducts() {
		this.operationsService.defineProducts(this.snapshot, this.products, this.companies);
		this.snapshot
			.filter(i => i.product)
			.forEach(i => {
				const p = this.products.find(f => f._id.$oid === i.product);
				this.operationsService.fillAttributes(i, p, this.productAttributes);
			});
		this.snapshot = this.snapshot.sort((a, b) => {
			return b.product ? 1 : -1;
		});
		this.map = this.operationsService.matchMarketProducts(this.snapshot, this.marketProducts);
		console.log(this.map);
	}

	getProduct(id: string) {
		return this.products.find(p => p._id.$oid === id);
	}

	saveSnapshot() {
		const json = JSON.stringify(this.snapshot);
		window.localStorage.setItem('grabber-snapshot', json);
	}

	performGrabber() {
		this.grabberService.create(this.item.grabber)
			.subscribe(
				r => {
					this.createSnapshot(r);
				},
				e => console.error(e)
			);
	}

	updateMarketProduct(d: MarketProductDto, exist: MarketProductDto) {
		exist.label = d.label;
		exist.available = d.available;
		exist.attributes = d.attributes;
		exist.price = d.price;

		this.marketProductsService.update(exist)
			.subscribe(r => {
				const i = this.marketProducts.findIndex(s => s.url === r.url);
				this.marketProducts[i] = r;
				this.map.set(d, r);
			});
	}

	createMarketProduct(d: MarketProductDto) {
		this.marketProductsService.create(d)
			.subscribe(r => {
				this.map.set(d, r);
				this.marketProducts.push(r);
			});
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

	private createSnapshot(rows: ResultRow[]) {
		let items: ResultItem[] = [];
		rows.forEach(r => {
			items = items.concat(r[1][0]);
		});
		const uniques = this.operationsService.getUnique(items);
		this.snapshot = uniques.map(u => {
			return this.operationsService.createMarketProduct(u, this.itemId);
		});
	}

	private fetchProducts() {
		this.productsService.list()
			.subscribe(d => this.products = d);
	}

	private fetchCompanies() {
		this.companiesService.list()
			.subscribe(d => this.companies = d);
	}

	private fetchProductAttributes() {
		this.productAttributesService.list()
			.subscribe(d => this.productAttributes = d);
	}

	private fetchMarketProducts() {
		this.marketProductsService
			.list({
				market: this.itemId
			})
			.subscribe(d => this.marketProducts = d);
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
