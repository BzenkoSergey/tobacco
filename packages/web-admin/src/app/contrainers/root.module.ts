import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
	MatCardModule,
	MatButtonModule,
	MatTableModule,
	MatFormFieldModule,
	MatInputModule,
	MatSelectModule,
	MatOptionModule,
	MatListModule
} from '@angular/material';

import { BreadcrumbsModule } from 'ng6-breadcrumbs';

import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';

@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,
		FlexLayoutModule,
		MatButtonModule,
		BrowserAnimationsModule,

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
