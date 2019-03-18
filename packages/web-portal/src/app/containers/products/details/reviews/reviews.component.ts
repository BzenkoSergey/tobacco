import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { AggregatedProductDto, AggregatedProductItemDto } from '@rest/products/product-full.dto';
import { ReviewsRestService, ReviewDto, ReviewType } from '@rest/reviews';

import { FiltersService } from './../../../filters.service';
import { LinkService } from './../../../link.service';

import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';
import { BreadcrumbModel } from '@components/breadcrumb/breadcrumb.model';

@Component({
	templateUrl: './reviews.html',
	styleUrls: ['./reviews.scss'],
	providers: [
		ReviewsRestService
	]
})

export class ReviewsComponent implements OnDestroy {
	product: AggregatedProductDto;
	loading = false;
	reviews: ReviewDto[] = [];

	constructor(
		private breadcrumb: BreadcrumbService,
		private title: Title,
		private meta: Meta,
		private filters: FiltersService,
		private linkService: LinkService,
		private service: ReviewsRestService,
		route: ActivatedRoute
	) {
		route.data.subscribe((data: { unit: AggregatedProductDto }) => {
			this.product = data.unit;
			this.loading = false;
			this.fetch();
		});
	}

	ngOnDestroy() {
		this.breadcrumb.remove('product-detail-add');
	}

	private fetch() {
		this.service.list({
			entityId: this.product.productId,
			type: ReviewType.UNIT
		}).subscribe(d => {
			this.reviews = d.items;
		});
	}
}
