import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ProductLinesRoutingModule } from './product-lines-routing.module';
import { ProductLinesComponent } from './product-lines.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,

		ProductLinesRoutingModule
	],
	declarations: [
		ProductLinesComponent
	],
	bootstrap: [
		ProductLinesComponent
	]
})

export class ProductLinesModule {}
