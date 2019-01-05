import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { UnitsDetailsInfoRoutingModule } from './info-routing.module';
import { UnitsDetailsInfoComponent } from './info.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		MappingKeysModule,
		UnitsDetailsInfoRoutingModule
	],
	declarations: [
		UnitsDetailsInfoComponent
	],
	exports: [
		UnitsDetailsInfoComponent
	]
})

export class UnitsDetailsInfoModule {}
