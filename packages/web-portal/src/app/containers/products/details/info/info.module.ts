import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

import { MixModule } from '@components/mix/mix.module';
import { ReviewModule } from '@components/review/review.module';
import { ProductsModule } from '@components/products/products.module';
import { IconModule } from '@components/icon/icon.module';

import { NavigationModule } from './../shared/navigation/navigation.module';

import { InfoRoutingModule } from './info-routing.module';
import { InfoComponent } from './info.component';

@NgModule({
	imports: [
		CommonModule,
		LazyLoadImageModule.forRoot({
			preset: intersectionObserverPreset
		}),
		ReviewModule,
		MixModule,
		IconModule,

		ProductsModule,
		NavigationModule,
		InfoRoutingModule
	],
	declarations: [
		InfoComponent
	],
	exports: [
		InfoComponent
	]
})

export class InfoModule {}

//node_modules/.bin/ivy-ngcc
