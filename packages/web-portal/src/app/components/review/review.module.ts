import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconModule } from './../icon/icon.module';

import { ReviewComponent } from './review.component';

@NgModule({
	imports: [
		CommonModule,
		IconModule
	],
	declarations: [
		ReviewComponent
	],
	exports: [
		ReviewComponent
	]
})

export class ReviewModule {}
