import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AceEditorModule } from 'ng2-ace-editor';

import { FlowTreeModule } from './../../flow-tree/flow-tree.module';
import { SchemeProcessComponent } from './process.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,

		AceEditorModule,
		FlowTreeModule
	],
	declarations: [
		SchemeProcessComponent
	],
	exports: [
		SchemeProcessComponent
	]
})

export class SchemeProcessModule {}
