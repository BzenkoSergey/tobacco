import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BreadcrumbsModule } from 'ng6-breadcrumbs';

import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';

@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,
		FlexLayoutModule,

		BreadcrumbsModule,
		RootRoutingModule
	],
	declarations: [
		RootComponent
	],
	bootstrap: [
		RootComponent
	]
})

export class RootModule {}
