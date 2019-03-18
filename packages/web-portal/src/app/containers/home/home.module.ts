import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

import { BreadcrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { ProductsModule } from '@components/products/products.module';
import { MixModule } from '@components/mix/mix.module';

import { SearchModule } from './../search/search.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
	imports: [
		CommonModule,

		HomeRoutingModule,
		SearchModule,
		BreadcrumbModule,
		MixModule,

		LazyLoadImageModule.forRoot({
			preset: intersectionObserverPreset
		}),
		ProductsModule
	],
	declarations: [
		HomeComponent
	],
	exports: [
		HomeComponent
	]
})

export class HomeModule {}
