import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		DetailsRoutingModule
	],
	declarations: [
		DetailsComponent
	],
	bootstrap: [
		DetailsComponent
	]
})

export class DetailsModule {}
