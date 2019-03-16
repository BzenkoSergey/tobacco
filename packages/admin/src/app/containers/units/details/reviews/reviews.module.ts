import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { UnitsDetailsReviewsRoutingModule } from './reviews-routing.module';
import { UnitsDetailsReviewsComponent } from './reviews.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		MappingKeysModule,
		UnitsDetailsReviewsRoutingModule
	],
	declarations: [
		UnitsDetailsReviewsComponent
	],
	exports: [
		UnitsDetailsReviewsComponent
	]
})

export class UnitsDetailsReviewsModule {}
