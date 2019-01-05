import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { UnitLinesRoutingModule } from './unit-lines-routing.module';
import { UnitLinesComponent } from './unit-lines.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		MappingKeysModule,
		UnitLinesRoutingModule
	],
	declarations: [
		UnitLinesComponent
	],
	exports: [
		UnitLinesComponent
	]
})

export class UnitLinesModule {}
