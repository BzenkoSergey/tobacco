import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PipeRestService } from '@rest/pipes/pipes.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		NgbModule.forRoot(),
		AppRoutingModule
	],
	declarations: [
		AppComponent
	],
	providers: [
		PipeRestService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
