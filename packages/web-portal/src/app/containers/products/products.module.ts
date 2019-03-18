import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';

import { SearchModule } from './../search/search.module';
import { FilterItemsModule } from './../filter-items/filter-items.module';
import { ClickOutsideModule } from '@components/click-outside/click-outside.module';
import { BreadcrumbModule } from '@components/breadcrumb/breadcrumb.module';

@NgModule({
	imports: [
		CommonModule,

		ProductsRoutingModule,
		BreadcrumbModule,
		ClickOutsideModule,
		SearchModule,
		FilterItemsModule
	],
	declarations: [
		ProductsComponent
	],
	exports: [
		ProductsComponent
	]
})

export class ProductsModule {}
