import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SchemesRoutingModule } from './schemes-routing.module';
import { SchemesComponent } from './schemes.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		SchemesRoutingModule
	],
	declarations: [
		SchemesComponent
	],
	bootstrap: [
		SchemesComponent
	]
})

export class SchemesModule {}
