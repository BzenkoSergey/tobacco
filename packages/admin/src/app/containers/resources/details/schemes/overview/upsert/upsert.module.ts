import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { UpsertComponent } from './upsert.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		NgbModalModule,
		NgbTypeaheadModule
	],
	declarations: [
		UpsertComponent
	],
	entryComponents: [
		UpsertComponent
	]
})

export class UpsertModule {}
