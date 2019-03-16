import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { UnitsRestService, UnitDto } from '@rest/units';
import { ReviewsRestService, ReviewDto, ReviewType } from '@rest/reviews';
import { PipeRestService } from '@rest/pipes';

@Component({
	templateUrl: './reviews.html',
	providers: [
		UnitsRestService,
		ReviewsRestService,
		PipeRestService
	]
})

export class UnitsDetailsReviewsComponent implements OnDestroy {
	private sub: Subscription;

	itemId: string;
	reviews: ReviewDto[] = [];
	review = new ReviewDto();
	item = new UnitDto();
	loading = false;

	constructor(
		private reviewsRestService: ReviewsRestService,
		private service: UnitsRestService,
		private pipesService: PipeRestService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.unitId;
			this.fetch();
			this.fetchReviews();
		});
	}

	add() {
		this.loading = true;
		this.review.entityId = this.itemId;
		this.review.datePublished = new Date().toISOString();
		this.create()
			.subscribe(
				() => {
					this.loading = false;
					this.review = new ReviewDto();
					this.fetchReviews();
				},
				e => this.loading = false
			);
	}

	update(review: ReviewDto) {
		this.loading = true;
		this.reviewsRestService.update(review._id, review)
			.subscribe(() => {
				this.loading = false;
			});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	remove(reviewId: string) {
		this.loading = true;
		this.reviewsRestService.remove(reviewId)
			.subscribe(() => {
				this.fetchReviews();
				this.loading = false;
			});
	}

	save() {
		this.loading = true;
		this.item.reviews = this.reviews.length;
		this.service.update(this.itemId, this.item)
			.subscribe(
				() => this.loading = false,
				() => this.loading = false
			);
	}

	aggregate() {
		this.pipesService.runSchemeOptions<any, any>(
			'PRODUCT_AGGREGATE',
			{
				data: {
					productId: this.itemId
				}
			}
		)
		.subscribe();

		this.pipesService.runSchemeOptions<any, any>(
			'MOVE_REVIEWS',
			{}
		)
		.subscribe();
	}

	private fetch() {
		this.loading = true;
		this.service.get(this.itemId)
			.subscribe(
				d => {
					this.item = d;
					this.loading = false;
				},
				() => this.loading = false
			);
	}

	private create() {
		return this.reviewsRestService.create(this.review);
	}

	private fetchReviews() {
		this.reviewsRestService
			.list(
				{
					type: ReviewType.UNIT,
					entityId: this.itemId
				},
				null,
				null,
				{
					datePublished: -1
				}
			)
			.subscribe(d => this.reviews = d);
	}
}
