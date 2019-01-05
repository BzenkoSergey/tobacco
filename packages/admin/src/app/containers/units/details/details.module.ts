import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { UnitsDetailsRoutingModule } from './details-routing.module';
import { UnitsDetailsComponent } from './details.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		MappingKeysModule,
		UnitsDetailsRoutingModule
	],
	declarations: [
		UnitsDetailsComponent
	],
	bootstrap: [
		UnitsDetailsComponent
	]
})

export class UnitsDetailsModule {}
