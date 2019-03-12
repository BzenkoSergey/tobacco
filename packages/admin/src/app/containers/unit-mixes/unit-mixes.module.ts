import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UnitMixesRoutingModule } from './unit-mixes-routing.module';
import { UnitMixesComponent } from './unit-mixes.component';

@NgModule({
	imports: [
		CommonModule,

		UnitMixesRoutingModule
	],
	declarations: [
		UnitMixesComponent
	],
	bootstrap: [
		UnitMixesComponent
	]
})

export class UnitMixesModule {}
