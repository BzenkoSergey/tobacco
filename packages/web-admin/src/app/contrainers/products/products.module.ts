import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,

		ProductsRoutingModule
	],
	declarations: [
		ProductsComponent
	],
	bootstrap: [
		ProductsComponent
	]
})

export class ProductsModule {}
