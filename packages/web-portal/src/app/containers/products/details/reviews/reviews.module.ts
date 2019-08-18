import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReviewModule } from '@components/review/review.module';
import { IconModule } from '@components/icon/icon.module';

import { NavigationModule } from './../shared/navigation/navigation.module';

import { ReviewsRoutingModule } from './reviews-routing.module';
import { ReviewsComponent } from './reviews.component';

@NgModule({
	imports: [
		CommonModule,

		ReviewModule,
		ReviewsRoutingModule,
		NavigationModule,
		IconModule
	],
	declarations: [
		ReviewsComponent
	],
	exports: [
		ReviewsComponent
	]
})

export class ReviewsModule {}
