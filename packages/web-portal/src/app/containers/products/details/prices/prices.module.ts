import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { NavigationModule } from './../shared/navigation/navigation.module';

import { PricesRoutingModule } from './prices-routing.module';
import { PricesComponent } from './prices.component';

@NgModule({
	imports: [
		CommonModule,
		LazyLoadImageModule,

		PricesRoutingModule,
		NavigationModule
	],
	declarations: [
		PricesComponent
	],
	exports: [
		PricesComponent
	]
})

export class PricesModule {}
