import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { IconModule } from './../icon/icon.module';
import { ProductsComponent } from './products.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,

		LazyLoadImageModule,
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
