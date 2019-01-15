import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UnitsDetailsSeoRoutingModule } from './seo-routing.module';
import { UnitsDetailsSeoComponent } from './seo.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		UnitsDetailsSeoRoutingModule
	],
	declarations: [
		UnitsDetailsSeoComponent
	],
	exports: [
		UnitsDetailsSeoComponent
	]
})

export class UnitsDetailsSeoModule {}
