import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { DeviceService } from '@common/device.service';
import { AggregatedProductDto, AggregatedProductItemDto } from '@rest/products';
import { BreadcrumbService, BreadcrumbModel } from '@components/breadcrumb';
import { ProductService } from '@common/products.service';

import { DetailsService } from './../details.service';

@Component({
	templateUrl: './prices.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class PricesComponent implements OnDestroy {
	private sub: Subscription;

	screenWidth = this.deviceService.width();
	unit: AggregatedProductDto;
	items: AggregatedProductItemDto[] = [];
	highPrice = 0;
	lowPrice = 0;
	hasAvailable = false;
	ranges: any[] = [];

	constructor(
		private deviceService: DeviceService,
		private productService: ProductService,
		private detailsService: DetailsService,
		private breadcrumb: BreadcrumbService,
		route: ActivatedRoute
	) {
		this.sub = route.data.subscribe((data: { unit: AggregatedProductDto }) => {
			const unit = data.unit;
			this.unit = unit;
			this.setPriceRanges();
			this.setHasAvailable();
			this.setRanges();
			this.setItems();
			this.detailsService.setMetaTitle(unit, null, 'Цены на');
			this.detailsService.setMetaUrl(unit, 'prices');
			this.detailsService.setMetaKeywords(unit);
			this.detailsService.setMetaDescription(unit, this.getDescription());
		});

		this.breadcrumb.add([
			new BreadcrumbModel({
				title: 'Цены',
				code: 'product-detail-add',
				url: null,
				last: true
			})
		]);
	}

	ngOnDestroy() {
		this.breadcrumb.remove('product-detail-add');
		this.detailsService.resetMeta([
			'og:title',
			'og:url',
			'og:description'
		]);
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	private setItems() {
		this.items = this.productService.sortByCheaperItems(this.unit.items)
			.sort((a, b) => {
				return (b.available ? 1 : 0) - (a.available ? 1 : 0);
			});
	}

	private setRanges() {
		this.ranges = this.productService.getRanges(this.unit.items);
	}

	private setHasAvailable() {
		this.hasAvailable = this.unit.items.some(i => i.available);
	}

	private setPriceRanges() {
		const ranges = this.productService.getPriceRange(this.unit.items);
		this.lowPrice = ranges[0];
		this.highPrice = ranges[1];
	}

	private getDescription() {
		return 'Цены от интернет-магазинов на ' + this.getMetaTitle(true) + ' ✔ от ' + this.lowPrice + ' до ' + this.highPrice + ' грн';
	}

	private getMetaTitle(noPostfix = false) {
		return this.detailsService.genMetaTitle(this.unit, noPostfix ? '' : 'Цены на');
	}
}
