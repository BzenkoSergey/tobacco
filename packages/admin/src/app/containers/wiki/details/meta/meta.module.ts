import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { WikiDetailsMetaRoutingModule } from './meta-routing.module';
import { WikiDetailsMetaComponent } from './meta.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		MappingKeysModule,
		WikiDetailsMetaRoutingModule
	],
	declarations: [
		WikiDetailsMetaComponent
	],
	exports: [
		WikiDetailsMetaComponent
	]
})

export class WikiDetailsMetaModule {}
