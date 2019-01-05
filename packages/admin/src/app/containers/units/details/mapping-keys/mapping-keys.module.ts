import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { UnitsDetailsMappingKeysRoutingModule } from './mapping-keys-routing.module';
import { UnitsDetailsMappingKeysComponent } from './mapping-keys.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		MappingKeysModule,
		UnitsDetailsMappingKeysRoutingModule
	],
	declarations: [
		UnitsDetailsMappingKeysComponent
	],
	exports: [
		UnitsDetailsMappingKeysComponent
	]
})

export class UnitsDetailsMappingKeysModule {}
