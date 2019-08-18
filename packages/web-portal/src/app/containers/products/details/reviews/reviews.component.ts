import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { AggregatedProductDto } from '@rest/products/product-full.dto';
import { ReviewsRestService, ReviewDto, ReviewType } from '@rest/reviews';

import { DeviceService } from '@common/device.service';
import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';
import { BreadcrumbModel } from '@components/breadcrumb/breadcrumb.model';

import { DetailsService } from '../details.service';

@Component({
	templateUrl: './reviews.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		ReviewsRestService
	]
})

export class ReviewsComponent implements OnDestroy {
	private sub: Subscription;

	screenWidth = this.deviceService.width();
	unit: AggregatedProductDto;
	reviews: ReviewDto[] = [];

	constructor(
		private deviceService: DeviceService,
		private cd: ChangeDetectorRef,
		private detailsService: DetailsService,
		private breadcrumb: BreadcrumbService,
		private service: ReviewsRestService,
		route: ActivatedRoute
	) {
		this.sub = route.data.subscribe((data: { unit: AggregatedProductDto }) => {
			const unit = data.unit;
			this.unit = unit;
			this.detailsService.setMetaTitle(unit, this.getMetaTitle());
			this.detailsService.setMetaUrl(unit, 'reviews');
			this.detailsService.setMetaKeywords(unit);
			this.detailsService.setMetaDescription(unit, this.getDescription());
			this.fetch();
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

	private getDescription() {
		return this.getMetaTitle() + ' ✔ всего отзывов ' + this.unit.reviews + ' ✔ рейтинг ' + this.unit.reviewsRating + ' с 10ти';
	}

	private getMetaTitle() {
		return this.detailsService.genMetaTitle(this.unit, 'Отзывы об');
	}

	private fetch() {
		this.service.list({
			entityId: this.unit.productId,
			type: ReviewType.UNIT
		}).subscribe(d => {
			this.reviews = d.items;
			this.cd.markForCheck();
		});
	}
}
