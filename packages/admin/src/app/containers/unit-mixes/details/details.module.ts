import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PieModule } from '@components/pie/pie.module';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		PieModule,
		DetailsRoutingModule
	],
	declarations: [
		DetailsComponent
	],
	exports: [
		DetailsComponent
	]
})

export class DetailsModule {}
