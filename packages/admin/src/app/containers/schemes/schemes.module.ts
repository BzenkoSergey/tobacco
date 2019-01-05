import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SchemesRoutingModule } from './schemes-routing.module';
import { SchemesComponent } from './schemes.component';

@NgModule({
	imports: [
		CommonModule,

		SchemesRoutingModule
	],
	declarations: [
		SchemesComponent
	],
	exports: [
		SchemesComponent
	]
})

export class SchemesModule {}
