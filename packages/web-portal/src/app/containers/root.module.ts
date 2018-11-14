import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PaginationModule } from '@components/pagination/pagination.module';

import { SearchModule } from './search/search.module';
import { FilterItemsModule } from './filter-items/filter-items.module';
import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';

@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,
		FlexLayoutModule,
		RouterModule,

		PaginationModule,
		FilterItemsModule,
		RootRoutingModule,
		SearchModule
	],
	declarations: [
		RootComponent
	],
	bootstrap: [
		RootComponent
	]
})

export class RootModule {}
