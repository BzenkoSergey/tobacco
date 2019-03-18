import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';

@NgModule({
	imports: [
		CommonModule,
		LazyLoadImageModule.forRoot({
			preset: intersectionObserverPreset
		}),
		DetailsRoutingModule
	],
	declarations: [
		DetailsComponent
	],
	exports: [
		DetailsComponent
	]
})

export class DetailsModule {}

//node_modules/.bin/ivy-ngcc
