import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AceEditorModule } from 'ng2-ace-editor';

import { RunInputModule } from './../run-input/run-input.module';
import { FlowTreeModule } from './../../flow-tree/flow-tree.module';
import { SchemeEditorComponent } from './editor.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,

		RunInputModule,
		AceEditorModule,
		FlowTreeModule
	],
	declarations: [
		SchemeEditorComponent
	],
	exports: [
		SchemeEditorComponent
	]
})

export class SchemeEditorModule {}
