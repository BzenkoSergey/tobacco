import { Component, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';

import { ProductsRestService } from '@rest/products';
import { AggregatedProductDto, AggregatedProductItemDto } from '@rest/products/product-full.dto';
import { SearchRestService } from '@rest/search';

@Component({
	selector: 'products',
	templateUrl: './products.html',
	styleUrls: ['./products.scss'],
	providers: [
		ProductsRestService,
		SearchRestService
	]
})

export class ProductsComponent implements OnChanges, OnDestroy {
	@Output() opened = new EventEmitter<string>();
	@Output() total = new EventEmitter<number>();
	@Input() queries: any = {};
	@Input() cols: number;
	@Input() openedId: string|null = null;
	@Input() absolutePath = false;
	@Input() hideEmpty = false;
	@Input() hideOffers = false;
	@Input() titleAs: 'originName'|'translate'|'composition' = 'composition';
	@Input() home = false;
	items: AggregatedProductDto[] = [];
	loading = false;
	link = [];

	constructor(
		private productsService: ProductsRestService,
		private searchRestService: SearchRestService
	) {}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.queries) {
			this.fetch();
		}

		if (this.absolutePath) {
			this.link = ['/products/detail'];
			return;
		}

		if (this.home) {
			this.link = ['./../products', 'all', this.queries.categories[0], 'all', 'all', 'detail'];
		} else {
			this.link = ['detail'];
		}
	}

	ngOnDestroy() {

	}

	getLink(readableName: string) {
		return this.link.concat(readableName);
	}

	tooggleItems(id: string) {
		this.opened.emit(id);
	}

	fetch() {
		this.loading = true;
		const products = this.productsService.list(this.queries);
		products
			.subscribe(
				list => {
					this.items = list.items;
					const total = list.total;
					this.total.emit(total);
					this.loading = false;
					if (total && this.queries.search) {
						this.searchRestService.create({
							query: this.queries.search
						})
						.subscribe();
					}
				},
				() => this.loading = false
			);
	}

	sortItems(items: AggregatedProductItemDto[]) {
		return items.sort((a, b) => {
			return a.price - b.price;
		});
	}

	getItems(p: AggregatedProductDto) {
		const map = new Map<string, AggregatedProductItemDto[]>();

		p.items.forEach(pm => {
			const pa = pm.productAttributes[0];
			if (pa) {
				let list2 = map.get(pa.value) || [];
				list2.push(pm);
				list2 = list2
					.filter((e, pos, arr) => {
						const i = arr.findIndex((f) => {
							return f.price === e.price;
						});
						return i === pos;
					})
					.sort((a, b) => {
						return a.price - b.price;
					});
				map.set(pa.value, list2);
			}
		});
		const info = [];
		if (!map.size) {
			let prices = '';
			if (p.items.length > 1) {
				prices += p.items[0].price;
				prices += '-' + p.items[p.items.length - 1].price;
			} else {
				prices += p.items[0].price;
			}
			info.push({
				attr: null,
				prices: prices
			});
			return info;
		}

		map.forEach((mps, key) => {
			let prices = '';
			if (mps.length > 1) {
				prices += mps[0].price;
				prices += '-' + mps[mps.length - 1].price;
			} else {
				prices += mps[0].price;
			}

			info.push({
				attr: key,
				prices: prices
			});
		});
		return info;
	}
}
