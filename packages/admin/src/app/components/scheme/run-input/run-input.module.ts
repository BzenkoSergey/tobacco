import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AceEditorModule } from 'ng2-ace-editor';
import { NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { RunInputComponent } from './run-input.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		AceEditorModule,
		NgbModalModule,
		NgbTypeaheadModule
	],
	declarations: [
		RunInputComponent
	],
	entryComponents: [
		RunInputComponent
	]
})

export class RunInputModule {}
