import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProductService } from '@common/products.service';

import { NavigationModule } from './shared/navigation/navigation.module';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';
import { DetailsService } from './details.service';

@NgModule({
	imports: [
		CommonModule,

		NavigationModule,
		DetailsRoutingModule
	],
	declarations: [
		DetailsComponent
	],
	exports: [
		DetailsComponent
	],
	providers: [
		ProductService,
		DetailsService
	]
})

export class DetailsModule {}
