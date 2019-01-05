import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmModule } from '@components/confirm/confirm.module';

import { UpsertModule } from './upsert/upsert.module';
import { StructuresRoutingModule } from './structures-routing.module';
import { StructuresComponent } from './structures.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		ConfirmModule,
		UpsertModule,
		StructuresRoutingModule
	],
	declarations: [
		StructuresComponent
	],
	bootstrap: [
		StructuresComponent
	]
})

export class StructuresModule {}
