import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ProductsSearchRoutingModule } from './products-search-routing.module';
import { ProductsSearchComponent } from './products-search.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,

		ProductsSearchRoutingModule
	],
	declarations: [
		ProductsSearchComponent
	],
	exports: [
		ProductsSearchComponent
	]
})

export class ProductsSearchModule {}
