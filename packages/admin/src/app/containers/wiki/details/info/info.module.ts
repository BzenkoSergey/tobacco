import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { WikiDetailsInfoRoutingModule } from './info-routing.module';
import { WikiDetailsInfoComponent } from './info.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		MappingKeysModule,
		WikiDetailsInfoRoutingModule
	],
	declarations: [
		WikiDetailsInfoComponent
	],
	exports: [
		WikiDetailsInfoComponent
	]
})

export class WikiDetailsInfoModule {}
