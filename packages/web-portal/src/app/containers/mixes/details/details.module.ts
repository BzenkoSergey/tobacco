import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';

@NgModule({
	imports: [
		CommonModule,
		DetailsRoutingModule,
		LazyLoadImageModule
	],
	declarations: [
		DetailsComponent
	],
	exports: [
		DetailsComponent
	]
})

export class DetailsModule {}
