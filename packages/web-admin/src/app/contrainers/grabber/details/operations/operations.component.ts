import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

import { GrabberJob } from '@magz/common';

import { MarketsRestService, MarketDto } from '@rest/markets';
import { GrabberRestService, ResultRow, ResultItem } from '@rest/grabber';
import { ProductDto, ProductsRestService } from '@rest/products';
import { ProductLineDto, ProductLinesRestService } from '@rest/product-lines';
import { CompanyDto, CompaniesRestService } from '@rest/companies';
import { ProductAttributeDto, ProductAttributesRestService } from '@rest/product-attributes';
import { MarketProductDto, MarketProductsRestService } from '@rest/market-products';
import { CategoriesRestService } from '@rest/categories';

import { AggregatedProductsRestService } from '@rest/aggregated-products/aggregated-products.service';
import { AggregatedProductsService } from './../../../shared/aggregated-products.service';

import { OperationsService } from './operations.service';
import { MarketProductItemModel } from './market-product-item.model';

@Component({
	templateUrl: './operations.html',
	styleUrls: ['./operations.scss'],
	providers: [
		OperationsService,
		MarketsRestService,
		GrabberRestService,
		ProductsRestService,
		ProductLinesRestService,
		CompaniesRestService,
		ProductAttributesRestService,
		MarketProductsRestService,

		CategoriesRestService,
		AggregatedProductsRestService,
		AggregatedProductsService
	]
})

export class OperationsComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	private products: ProductDto[] = [];
	private productAttributes: ProductAttributeDto[] = [];
	private marketProducts: MarketProductDto[] = [];

	companies: CompanyDto[] = [];
	productLines: ProductLineDto[] = [];

	loading = false;
	processing = false;
	item = new MarketDto();
	snapshot: MarketProductItemModel[] = [];
	snapshotDisplayed: MarketProductItemModel[] = [];
	searchQuery = '';
	company = '';
	productLine = '';
	changed = null;
	created = null;
	attributes = null;

	items: ResultRow[] = [];
	sortBy = '';
	status = false;
	availabled = null;
	processed = null;
	withProductLine = null;

	constructor(
		private service: MarketsRestService,
		private marketProductsService: MarketProductsRestService,
		private productAttributesService: ProductAttributesRestService,
		private companiesService: CompaniesRestService,
		private productsService: ProductsRestService,
		private productLinesService: ProductLinesRestService,
		private grabberService: GrabberRestService,
		private operationsService: OperationsService,
		private aggregatedProductsService: AggregatedProductsService,
		private router: Router,
		route: ActivatedRoute
	) {
		window['f'] = this;
		console.log('reinit');
		route.queryParams.subscribe(p => {
			this.searchQuery = p.search;
			this.productLine = p.productLine;
			this.company = p.company;
			this.sortBy = p.sortBy || '';
			if (p.withProductLine === 'true') {
				this.withProductLine = true;
			}
			if (p.withProductLine === 'false') {
				this.withProductLine = false;
			}
			if (p.attributes === 'true') {
				this.attributes = true;
			}
			if (p.attributes === 'false') {
				this.attributes = false;
			}
			if (p.changed === 'true') {
				this.changed = true;
			}
			if (p.changed === 'false') {
				this.changed = false;
			}
			if (p.created === 'true') {
				this.created = true;
			}
			if (p.created === 'false') {
				this.created = false;
			}
			if (p.available === 'true') {
				this.availabled = true;
			}
			if (p.available === 'false') {
				this.availabled = false;
			}
			if (p.processed === 'true') {
				this.processed = true;
			}
			if (p.processed === 'false') {
				this.processed = false;
			}
			this.filterItems();
			console.log(p);
		});

		route.params
			.pipe(first())
			.subscribe(params => {
				this.itemId = params.marketId;
				combineLatest(this.fetchGlobals())
					.pipe(first())
					.subscribe(d => {
						this.fetchMarket();
						this.fetchStreem();
						this.fetchStatus();
					});
			});


		window['d'] = this;
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	deleteRemoved() {
		this.snapshot
			.filter(i => i.label === 'Removed')
			.forEach(i => this.removeMarketProduct(i));
	}

	removeMarketProduct(item: MarketProductItemModel) {
		this.marketProductsService.remove(item.alias)
			.subscribe(() => {
				const i = this.marketProducts.findIndex(s => s._id.$oid === item.alias._id.$oid);
				this.marketProducts.splice(i, 1);
				item.alias = null;

				// console.log(item.product);
				this.aggregatedProductsService.aggregate(item.product);
			});
	}

	setChanged() {
		this.router.navigate([], {
			queryParams: {
				changed: this.changed
			},
			queryParamsHandling: 'merge'
		});
	}

	setWithProductLine() {
		this.router.navigate([], {
			queryParams: {
				withProductLine: this.withProductLine
			},
			queryParamsHandling: 'merge'
		});
	}

	setCreated() {
		this.router.navigate([], {
			queryParams: {
				created: this.created
			},
			queryParamsHandling: 'merge'
		});
	}

	setAttributes() {
		this.router.navigate([], {
			queryParams: {
				attributes: this.attributes
			},
			queryParamsHandling: 'merge'
		});
	}

	setSortBy() {
		this.router.navigate([], {
			queryParams: {
				sortBy: this.sortBy
			},
			queryParamsHandling: 'merge'
		});
	}

	setProcessed() {
		this.router.navigate([], {
			queryParams: {
				processed: this.processed
			},
			queryParamsHandling: 'merge'
		});
	}

	setProductLine() {
		this.router.navigate([], {
			queryParams: {
				productLine: this.productLine
			},
			queryParamsHandling: 'merge'
		});
	}

	setCompany() {
		this.router.navigate([], {
			queryParams: {
				company: this.company,
				productLine: ''
			},
			queryParamsHandling: 'merge'
		});
	}

	getProductLines() {
		if (!this.company) {
			return this.productLines;
		}
		return this.productLines.filter(p => p.company === this.company);
	}

	search() {
		this.router.navigate([], {
			queryParams: {
				search: this.searchQuery
			},
			queryParamsHandling: 'merge'
		});
	}

	setAvailable() {
		this.router.navigate([], {
			queryParams: {
				available: this.availabled
			},
			queryParamsHandling: 'merge'
		});
	}

	getProductLine(productLineId: string) {
		return this.productLines.find(p => p._id.$oid === productLineId);
	}

	run(testMode = false) {
		this.grabberService.get(this.itemId)
			.subscribe(job => {
				if (!job) {
					job = new GrabberJob();
					job.id = this.itemId;
					job.config = this.item.grabber;
					job.config.testMode = testMode;
					this.grabberService.create(job)
						.subscribe(f => {
							this.grabberService.run(f)
								.subscribe(g => {
									console.log(g);
								});
						});
				} else {
					this.status = true;
					this.grabberService.run(job)
						.subscribe(f => console.log(f));
				}
			});
	}

	fetchStatus() {
		this.grabberService.status(this.itemId)
			.subscribe(d => this.status = d);
	}

	fetchStreem() {
		this.grabberService.stream(this.itemId)
			.subscribe(d => {
				this.items = d;
				this.createSnapshot(d);
				this.findProducts();
			});
	}

	getChanges(grabbed: MarketProductItemModel) {
		if (!grabbed.alias) {
			return {};
		}
		return this.operationsService.getChanges(grabbed, grabbed.alias);
	}

	hasChanges(grabbed: MarketProductItemModel) {
		const changes = this.getChanges(grabbed);
		return Object.keys(changes)
			.some(p => {
				return changes[p] === true;
			});
	}

	saveItems() {
		this.snapshot
			.filter(i => i.product)
			.filter(i => this.hasChanges(i))
			.forEach(i => {
				if (!i.alias) {
					return;
				}
				this.updateMarketProduct(i);
			});
	}

	findProducts() {
		this.processing = true;
		setTimeout(() => {
			console.log(Date.now(), 'start');
			this.operationsService.defineCompanies(this.snapshot, this.companies);
			console.log(Date.now(), 'start 1');
			this.operationsService.defineProductLine(this.snapshot, this.companies, this.productLines);
			console.log(Date.now(), 'start 2');
			this.operationsService.defineAliases(this.snapshot, this.marketProducts);
			console.log(Date.now(), 'start 3');
			this.operationsService.defineProducts(this.snapshot, this.products, this.companies);
			console.log(Date.now(), 'pre-middle');
			this.snapshot
				.filter(i => i.product)
				.forEach(i => {
					const p = this.products.find(f => f._id.$oid === i.product);
					if (!p) {
						i.product = null;
						return;
					}
					this.operationsService.fillAttributes(i, p, this.productAttributes);
				});
			this.marketProducts
				.filter(mp => {
					return !this.snapshot.some(s => s.url === mp.url);
				})
				.forEach(mp => {
					const d = new MarketProductItemModel();
					d.label = 'Removed';
					d.alias = mp;
					d.product = mp.product;
					this.snapshot.push(d);
					console.log(mp);
				});

			this.snapshot = this.snapshot.sort((a, b) => {
				return b.product ? 1 : -1;
			});
			this.operationsService.defineQuality(this.snapshot, this.productAttributes);
			this.filterItems();
			console.log(Date.now(), 'end');
			this.processing = false;
		}, 200);
	}

	getProduct(id: string) {
		return this.products.find(p => p._id.$oid === id);
	}

	updateMarketProduct(d: MarketProductItemModel) {
		const exist = d.alias;
		exist.label = d.label;
		exist.available = d.available;
		exist.attributes = d.attributes;
		exist.price = d.price;

		this.marketProductsService.update(exist)
			.subscribe(r => {
				const i = this.marketProducts.findIndex(s => s.url === r.url);
				this.marketProducts[i] = r;

				this.aggregatedProductsService.aggregate(exist.product);
			});
	}

	createMarketProduct(d: MarketProductItemModel) {
		const mp = new MarketProductDto();
		mp.attributes = d.attributes;
		mp.available = d.available;
		mp.createdDate = d.createdDate;
		mp.label = d.label;
		mp.market = d.market;
		mp.price = d.price;
		mp.product = d.product;
		mp.updatedDate = d.updatedDate;
		mp.url = d.url;
		this.marketProductsService.create(mp)
			.subscribe(r => {
				this.marketProducts.push(r);
				d.alias = r;

				this.aggregatedProductsService.aggregate(d.product);
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

	private filterItems() {
		this.snapshotDisplayed = this.snapshot;
		if (this.company) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				if (!s.companyDto) {
					return false;
				}
				return s.companyDto._id.$oid === this.company;
			});
		}
		if (this.productLine) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				if (!s.productLineDto) {
					return false;
				}
				return s.productLineDto._id.$oid === this.productLine;
			});
		}
		if (this.searchQuery) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				if (typeof s.label !== 'string') {
					console.log(s);
					return false;
				}
				return !!s.label.match(new RegExp(this.searchQuery, 'ig'));
			});
		}
		if (this.availabled === true) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				return s.available;
			});
		}
		if (this.availabled === false) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				return !s.available;
			});
		}
		if (this.processed === true) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				return s.product;
			});
		}
		if (this.processed === false) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				return !s.product;
			});
		}
		if (this.sortBy !== '') {
			if (this.sortBy === 'name') {
				this.snapshotDisplayed = this.snapshotDisplayed.sort((a, b) => {
					return a.label.localeCompare(b.label);
				});
			}
			if (this.sortBy === 'quality') {
				this.snapshotDisplayed = this.snapshotDisplayed.sort((a, b) => {
					return b.quality - a.quality;
				});
			}
		}
		if (this.changed === true) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				return this.hasChanges(s);
			});
		}
		if (this.changed === false) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				return !this.hasChanges(s);
			});
		}
		if (this.created === true) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				return !!s.alias;
			});
		}
		if (this.created === false) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				return !s.alias;
			});
		}
		if (this.attributes === true) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				return !!s.attributes.every(a => !!a.value);
			});
		}
		if (this.attributes === false) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				return !s.attributes.every(a => !!a.value);
			});
		}
		if (this.withProductLine === true) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				return !!s.productLineDto;
			});
		}
		if (this.withProductLine === false) {
			this.snapshotDisplayed = this.snapshotDisplayed.filter(s => {
				return !s.productLineDto;
			});
		}
	}

	private createSnapshot(rows: ResultRow[]) {
		let items: ResultItem[] = [];
		rows.forEach(r => {
			items = items.concat(r[1][0]);
		});
		const uniques = this.operationsService.getUnique(items);
		this.snapshot = uniques.map(u => {
			const item = new MarketProductItemModel();
			item.market = this.itemId;
			item.label = u.label;
			item.available = u.available;
			item.price = u.price;
			item.url = u.url;
			return item;
			// return this.operationsService.createMarketProduct(u, this.itemId);
		});
		// .filter(d => {
		// 	return !!~d.label.indexOf('Buta');
		// });
	}

	private fetchGlobals() {
		const subj = combineLatest(
			this.fetchProducts(),
			this.fetchCompanies(),
			this.fetchProductAttributes(),
			this.fetchMarketProducts(),
			this.fetchProductLines()
		);
		subj.subscribe(d => {
			this.products = d[0];
			this.companies = d[1];
			this.productAttributes = d[2];
			this.marketProducts = d[3];
			this.productLines = d[4];
		});
		return subj;
	}

	private fetchProducts() {
		return this.productsService.list();
	}

	private fetchCompanies() {
		return this.companiesService.list();
	}

	private fetchProductAttributes() {
		return this.productAttributesService.list();
	}

	private fetchProductLines() {
		return this.productLinesService.list();
	}

	private fetchMarketProducts() {
		console.log('//////', this.itemId);
		return this.marketProductsService
			.list({
				market: this.itemId
			});
	}

	private fetchMarket() {
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
