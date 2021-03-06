import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

import { MarketProductsRoutingModule } from './market-products-routing.module';
import { MarketProductsComponent } from './market-products.component';

@NgModule({
	imports: [
		CommonModule,
		MatPaginatorModule,
		MatButtonModule,
		FlexLayoutModule,

		MarketProductsRoutingModule
	],
	declarations: [
		MarketProductsComponent
	],
	bootstrap: [
		MarketProductsComponent
	]
})

export class MarketProductsModule {}
