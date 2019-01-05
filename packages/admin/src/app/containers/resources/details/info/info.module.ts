import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InfoRoutingModule } from './info-routing.module';
import { InfoComponent } from './info.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		InfoRoutingModule
	],
	declarations: [
		InfoComponent
	],
	bootstrap: [
		InfoComponent
	]
})

export class InfoModule {}
