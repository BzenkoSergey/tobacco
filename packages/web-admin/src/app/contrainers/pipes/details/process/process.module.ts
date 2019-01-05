import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
	MatCardModule,
	MatButtonModule,
	MatTableModule,
	MatFormFieldModule,
	MatInputModule,
	MatSelectModule,
	MatOptionModule,
	MatListModule
} from '@angular/material';
import { AceEditorModule } from 'ng2-ace-editor';

import { PipesDetailsProcessRoutingModule } from './process-routing.module';
import { PipesDetailsProcessComponent } from './process.component';

import { FlowTreeModule } from '@components/flow-tree/flow-tree.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		MatCardModule,
		MatButtonModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatOptionModule,
		MatListModule,
		FlexLayoutModule,
		AceEditorModule,

		PipesDetailsProcessRoutingModule,

		FlowTreeModule
	],
	declarations: [
		PipesDetailsProcessComponent
	],
	exports: [
		PipesDetailsProcessComponent
	]
})

export class PipesDetailsProcessModule {}
