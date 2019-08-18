import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PaginationModule } from '@components/pagination/pagination.module';
import { BreadcrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { ProductsModule } from '@components/products/products.module';
import { IconModule } from '@components/icon/icon.module';
import { FiltersModule } from '@components/filters/filters.module';

import { SearchModule } from './../../shared/search/search.module';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewService } from './overview.service';
import { OverviewComponent } from './overview.component';

@NgModule({
	imports: [
		CommonModule,

		PaginationModule,
		OverviewRoutingModule,
		SearchModule,
		BreadcrumbModule,
		ProductsModule,
		IconModule,
		FiltersModule
	],
	declarations: [
		OverviewComponent
	],
	exports: [
		OverviewComponent
	],
	providers: [
		OverviewService
	]
})

export class OverviewModule {}
