import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { DeviceService } from '@common/device.service';
import { ParamsService } from '@common/params.service';
import { MenuService } from '@common/menu.service';
import { LinkService } from '@common/link.service';

import { AnalyticsService } from '@common/analytics.service';
import { GAService } from '@common/ga.service';

import { FeedbackModule } from '@components/feedback/feedback.module';
import { IconModule } from '@components/icon/icon.module';
import { IconService } from '@components/icon/icon.service';
import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';

import { MenuRestService } from '@rest/menu';
import { AnalyticsRestService } from '@rest/analytics';

import { environment } from './../../environments/environment';
import { SearchModule } from './shared/search/search.module';

import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';

@NgModule({
	imports: [
		BrowserModule.withServerTransition({
			appId: 'web-portal'
		}),
		TransferHttpCacheModule,
		HttpClientModule,
		RouterModule,

		FeedbackModule,
		IconModule,
		SearchModule,
		RootRoutingModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production
		})
	],
	declarations: [
		RootComponent
	],
	providers: [
		ParamsService,
		DeviceService,
		LinkService,
		BreadcrumbService,
		MenuRestService,
		MenuService,
		AnalyticsRestService,
		AnalyticsService,
		GAService,
		Title,
		Meta,
		IconService
	],
	bootstrap: [
		RootComponent
	]
})

export class RootModule {}
