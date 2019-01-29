import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AceEditorModule } from 'ng2-ace-editor';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { WikiDetailsFieldsRoutingModule } from './fields-routing.module';
import { WikiDetailsFieldsComponent } from './fields.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		AceEditorModule,

		MappingKeysModule,
		WikiDetailsFieldsRoutingModule
	],
	declarations: [
		WikiDetailsFieldsComponent
	],
	exports: [
		WikiDetailsFieldsComponent
	]
})

export class WikiDetailsFieldsModule {}
