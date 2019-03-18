import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

import { PricesRoutingModule } from './prices-routing.module';
import { PricesComponent } from './prices.component';

@NgModule({
	imports: [
		CommonModule,
		LazyLoadImageModule.forRoot({
			preset: intersectionObserverPreset
		}),
		PricesRoutingModule
	],
	declarations: [
		PricesComponent
	],
	exports: [
		PricesComponent
	]
})

export class PricesModule {}

//node_modules/.bin/ivy-ngcc
