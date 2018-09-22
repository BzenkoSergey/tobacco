import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesComponent } from './companies.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,

		CompaniesRoutingModule
	],
	declarations: [
		CompaniesComponent
	],
	bootstrap: [
		CompaniesComponent
	]
})

export class CompaniesModule {}
