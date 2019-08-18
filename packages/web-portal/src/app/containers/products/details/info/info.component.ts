import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { DeviceService } from '@common/device.service';
import { ProductService } from '@common/products.service';

import { MixesRestService } from '@rest/mixes';
import { ReviewsRestService, ReviewDto, ReviewType } from '@rest/reviews';
import { AggregatedProductDto, AggregatedProductItemDto } from '@rest/products';

import { DetailsService } from './../details.service';

@Component({
	templateUrl: './info.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		MixesRestService,
		ReviewsRestService
	]
})

export class InfoComponent implements OnDestroy {
	private sub: Subscription;

	unit: AggregatedProductDto;
	productsTotal = 0;
	productsQueries: any = null;

	hasAvailable = true;
	mixes: any[] = [];
	reviews: ReviewDto[] = [];
	screenWidth = this.deviceService.width();
	highPrice = 0;
	lowPrice = 0;
	ranges: any[] = [];
	offers: AggregatedProductItemDto[] = [];
	fields: any = [];

	constructor(
		private cd: ChangeDetectorRef,
		private productService: ProductService,
		private deviceService: DeviceService,
		private reviewsRestService: ReviewsRestService,
		private mixesRestService: MixesRestService,
		private detailsService: DetailsService,
		route: ActivatedRoute
	) {
		this.sub = route.data.subscribe((data: { unit: AggregatedProductDto }) => {
			const unit = data.unit;
			this.unit = unit;
			this.detailsService.setMetaTitle(unit);
			this.detailsService.setMetaDescription(unit);
			this.detailsService.setMetaUrl(unit);
			this.detailsService.setMetaKeywords(unit);

			if (unit.reviews) {
				this.fetchReviews();
			}
			this.defineFields();
			this.setOffers();
			this.setPriceRanges();
			this.setRanges();
			this.fetchMixes();
			this.setProductsQueries();
			this.setHasAvailable();
			this.cd.markForCheck();
		});
	}

	ngOnDestroy() {
		this.detailsService.resetMeta([
			'og:title',
			'og:url',
			'og:description'
		]);
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	private defineFields() {
		this.fields = this.unit.fields.filter(f => {
			const value = f.value;
			if (value.length > 30) {
				return false;
			}
			return !~value.indexOf('http');
		});
	}

	private setHasAvailable() {
		this.hasAvailable = this.unit.items.some(i => i.available);
	}

	private setOffers() {
		this.offers = this.productService.sortByCheaperItems(this.unit.items, true).slice(0, 3);
	}

	private setRanges() {
		this.ranges = this.productService.getRanges(this.unit.items);
	}

	private setPriceRanges() {
		const ranges = this.productService.getPriceRange(this.unit.items);
		this.lowPrice = ranges[0];
		this.highPrice = ranges[1];
	}

	private fetchReviews() {
		this.reviewsRestService.list({
			entityId: this.unit.productId,
			type: ReviewType.UNIT,
			itemsPerPage: 3
		}).subscribe(d => {
			this.reviews = d.items;
			this.cd.markForCheck();
		});
	}

	private fetchMixes() {
		this.mixesRestService.list({
			units: [this.unit.productId]
		})
		.subscribe(d => {
			this.mixes = d.items;
			this.cd.markForCheck();
		});
	}

	private setProductsQueries() {
		const r = this.unit.name.split(' / ');
		let search = r[0];
		if (r[1]) {
			search += '|' + r[1];
		}
		this.productsQueries = {
			or: true,
			search: search,
			company: [this.unit.company.code],
			exclude: [this.unit.readableName],
			itemsPerPage: 5,
			categories: this.unit.categories.map(c => c.code)
		};
	}
}
