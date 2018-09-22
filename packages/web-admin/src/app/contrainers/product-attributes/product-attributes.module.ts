import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ProductAttributesRoutingModule } from './product-attributes-routing.module';
import { ProductAttributesComponent } from './product-attributes.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,

		ProductAttributesRoutingModule
	],
	declarations: [
		ProductAttributesComponent
	],
	bootstrap: [
		ProductAttributesComponent
	]
})

export class ProductAttributesModule {}
