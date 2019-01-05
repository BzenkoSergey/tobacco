import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { UnitAttributesRoutingModule } from './unit-attributes-routing.module';
import { UnitAttributesComponent } from './unit-attributes.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		NgbCollapseModule,

		MappingKeysModule,
		UnitAttributesRoutingModule
	],
	declarations: [
		UnitAttributesComponent
	],
	exports: [
		UnitAttributesComponent
	]
})

export class UnitAttributesModule {}
