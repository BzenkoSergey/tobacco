import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesComponent } from './companies.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		MappingKeysModule,
		CompaniesRoutingModule
	],
	declarations: [
		CompaniesComponent
	],
	exports: [
		CompaniesComponent
	]
})

export class CompaniesModule {}
