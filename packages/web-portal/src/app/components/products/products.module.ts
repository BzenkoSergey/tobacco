import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

import { IconModule } from './../icon/icon.module';
import { ProductsComponent } from './products.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,

		LazyLoadImageModule.forRoot({
			preset: intersectionObserverPreset
		}),
		IconModule
	],
	declarations: [
		ProductsComponent
	],
	exports: [
		ProductsComponent
	]
})

export class ProductsModule {}
