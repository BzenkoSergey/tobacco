import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WlRoutingModule } from './wl-routing.module';
import { WlComponent } from './wl.component';

@NgModule({
	imports: [
		CommonModule,

		WlRoutingModule
	],
	declarations: [
		WlComponent
	],
	exports: [
		WlComponent
	]
})

export class WlModule {}
