import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MixesRoutingModule } from './mixes-routing.module';
import { MixesComponent } from './mixes.component';

import { SearchModule } from './../search/search.module';
import { FilterItemsModule } from './../filter-items/filter-items.module';
import { ClickOutsideModule } from '@components/click-outside/click-outside.module';
import { BreadcrumbModule } from '@components/breadcrumb/breadcrumb.module';

@NgModule({
	imports: [
		CommonModule,

		MixesRoutingModule,
		BreadcrumbModule,
		ClickOutsideModule,
		SearchModule,
		FilterItemsModule
	],
	declarations: [
		MixesComponent
	],
	exports: [
		MixesComponent
	]
})

export class MixesModule {}
