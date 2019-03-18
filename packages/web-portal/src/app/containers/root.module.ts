import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { IconModule } from '@components/icon/icon.module';
import { IconService } from '@components/icon/icon.service';
import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';
import { MenuRestService } from '@rest/menu';
import { AnalyticsRestService } from '@rest/analytics';

import { environment } from './../../environments/environment';

import { FiltersService } from './filters.service';
import { MenuService } from './menu.service';
import { LinkService } from './link.service';
import { AnalyticsService } from './analytics.service';

import { SearchModule } from './search/search.module';

import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';

@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule,

		IconModule,
		SearchModule,
		RootRoutingModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
	],
	declarations: [
		RootComponent
	],
	providers: [
		LinkService,
		BreadcrumbService,
		MenuRestService,
		MenuService,
		FiltersService,
		AnalyticsRestService,
		AnalyticsService,
		Title,
		Meta,
		IconService
	],
	bootstrap: [
		RootComponent
	]
})

export class RootModule {}
