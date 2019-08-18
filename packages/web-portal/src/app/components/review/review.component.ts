import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { ReviewDto } from '@rest/reviews';

@Component({
	selector: 'review',
	templateUrl: './review.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReviewComponent {
	@Input() review: ReviewDto;
	@Input() hideDate = false;
}
