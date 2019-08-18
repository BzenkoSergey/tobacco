import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { BreadcrumbModule } from '@components/breadcrumb';
import { ProductsModule } from '@components/products/products.module';
import { MixModule } from '@components/mix/mix.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
	imports: [
		CommonModule,

		LazyLoadImageModule,
		HomeRoutingModule,
		BreadcrumbModule,
		MixModule,
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
