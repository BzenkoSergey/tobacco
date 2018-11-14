import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SearchComponent } from './search.component';

@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,
		FlexLayoutModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		SearchComponent
	],
	exports: [
		SearchComponent
	]
})

export class SearchModule {}
