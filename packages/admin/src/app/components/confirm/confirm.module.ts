import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmComponent } from './confirm.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		NgbModalModule
	],
	declarations: [
		ConfirmComponent
	],
	entryComponents: [
		ConfirmComponent
	]
})

export class ConfirmModule {}
