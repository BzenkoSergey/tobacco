import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReviewModule } from '@components/review/review.module';

import { ReviewsRoutingModule } from './reviews-routing.module';
import { ReviewsComponent } from './reviews.component';

@NgModule({
	imports: [
		CommonModule,

		ReviewModule,
		ReviewsRoutingModule
	],
	declarations: [
		ReviewsComponent
	],
	exports: [
		ReviewsComponent
	]
})

export class ReviewsModule {}
