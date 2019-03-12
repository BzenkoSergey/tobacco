import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { DetailsInfoRoutingModule } from './info-routing.module';
import { DetailsInfoComponent } from './info.component';
import { PieModule } from '@components/pie/pie.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		PieModule,
		MappingKeysModule,
		DetailsInfoRoutingModule
	],
	declarations: [
		DetailsInfoComponent
	],
	exports: [
		DetailsInfoComponent
	]
})

export class DetailsInfoModule {}
