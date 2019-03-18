import { Component, Input } from '@angular/core';

import { ReviewDto } from '@rest/reviews';

@Component({
	selector: 'review',
	templateUrl: './review.html'
})

export class ReviewComponent {
	@Input() review: ReviewDto;
	@Input() hideDate = false;
}
