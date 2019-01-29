import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AceEditorModule } from 'ng2-ace-editor';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { WikiDetailsMappingRoutingModule } from './mapping-routing.module';
import { WikiDetailsMappingComponent } from './mapping.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		AceEditorModule,

		MappingKeysModule,
		WikiDetailsMappingRoutingModule
	],
	declarations: [
		WikiDetailsMappingComponent
	],
	exports: [
		WikiDetailsMappingComponent
	]
})

export class WikiDetailsMappingModule {}
