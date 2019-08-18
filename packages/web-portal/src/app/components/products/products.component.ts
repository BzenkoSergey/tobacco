import {
	Component,
	Input,
	OnChanges,
	SimpleChanges,
	Output,
	EventEmitter,
	ChangeDetectionStrategy,
	ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';

import { DeviceService } from '@common/device.service';
import { ProductsRestService, AggregatedProductDto, AggregatedProductItemDto } from '@rest/products';
import { SearchRestService } from '@rest/search';
import { ProductService } from '@common/products.service';

@Component({
	selector: 'products',
	templateUrl: './products.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		ProductService,
		ProductsRestService,
		SearchRestService
	]
})

export class ProductsComponent implements OnChanges {
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
	@Input() showLoadMode = false;

	totalItems = 0;
	items: AggregatedProductDto[] = [];
	loading = false;
	link = [];
	isMobile = this.deviceService.isMobile();
	isLoadingMore = false;

	constructor(
		private router: Router,
		private cd: ChangeDetectorRef,
		private deviceService: DeviceService,
		private productsRestService: ProductsRestService,
		private productsService: ProductService,
		private searchRestService: SearchRestService
	) {}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.queries && changes.queries.currentValue) {
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

	getHighPrice(p: AggregatedProductDto) {
		const ranges = this.productsService.getPriceRange(p.items);
		return ranges[1];
	}

	getLowPrice(p: AggregatedProductDto) {
		const ranges = this.productsService.getPriceRange(p.items);
		return ranges[0];
	}

	loadMore() {
		this.isLoadingMore = true;
		this.router.navigate([], {
			queryParams: {
				page: (this.queries.page || 0) + 1
			}
		});
	}

	getLink(readableName: string) {
		return this.link.concat(readableName);
	}

	tooggleItems(id: string) {
		this.opened.emit(id);
	}

	fetch() {
		this.loading = true;
		this.productsRestService.list(this.queries)
			.subscribe(
				list => {
					if (this.isLoadingMore) {
						this.items = this.items.concat(list.items);
					} else {
						this.items = list.items;
					}
					this.isLoadingMore = false;
					const total = list.total;
					this.totalItems = total;
					this.total.emit(total);
					this.loading = false;
					this.cd.markForCheck();
					if (total && this.queries.search) {
						this.searchRestService.create({
							query: this.queries.search
						})
						.subscribe();
					}
				},
				() => {
					this.loading = false;
					this.cd.markForCheck();
				}
			);
	}

	trackByFn(index: number, item: AggregatedProductDto) {
		return item.readableName;
	}

	sortItems(items: AggregatedProductItemDto[]) {
		return this.productsService.sortByCheaperItems(items);
	}

	getRanges(p: AggregatedProductDto) {
		const spaces = this.isMobile ? ' ' : '';
		return this.productsService.getRanges(p.items, spaces);
	}
}
