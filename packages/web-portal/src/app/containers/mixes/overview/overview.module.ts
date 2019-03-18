import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

import { PaginationModule } from '@components/pagination/pagination.module';
import { ClickOutsideModule } from '@components/click-outside/click-outside.module';
import { BreadcrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { ProductsModule } from '@components/products/products.module';
import { MixModule } from '@components/mix/mix.module';
import { IconModule } from '@components/icon/icon.module';

import { SearchModule } from './../../search/search.module';
import { FilterItemsModule } from './../../filter-items/filter-items.module';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';

@NgModule({
	imports: [
		CommonModule,

		PaginationModule,
		OverviewRoutingModule,
		SearchModule,
		FilterItemsModule,
		ClickOutsideModule,
		BreadcrumbModule,
		ProductsModule,
		MixModule,
		IconModule,

		LazyLoadImageModule.forRoot({
			preset: intersectionObserverPreset
		})
	],
	declarations: [
		OverviewComponent
	],
	exports: [
		OverviewComponent
	]
})

export class OverviewModule {}
