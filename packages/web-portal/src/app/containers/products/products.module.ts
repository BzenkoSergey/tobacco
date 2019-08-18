import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';

import { BreadcrumbModule } from '@components/breadcrumb/breadcrumb.module';

@NgModule({
	imports: [
		CommonModule,

		ProductsRoutingModule,
		BreadcrumbModule
	],
	declarations: [
		ProductsComponent
	],
	exports: [
		ProductsComponent
	]
})

export class ProductsModule {}
