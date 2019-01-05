import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AceEditorModule } from 'ng2-ace-editor';

import { SchemeProcessModule } from '@components/scheme/process/process.module';

import { ProcessRoutingModule } from './process-routing.module';
import { ProcessComponent } from './process.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		AceEditorModule,

		SchemeProcessModule,
		ProcessRoutingModule
	],
	declarations: [
		ProcessComponent
	],
	bootstrap: [
		ProcessComponent
	]
})

export class ProcessModule {}
