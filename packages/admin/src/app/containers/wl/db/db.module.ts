import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DbRoutingModule } from './db-routing.module';
import { DbComponent } from './db.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		DbRoutingModule
	],
	declarations: [
		DbComponent
	],
	exports: [
		DbComponent
	]
})

export class DbModule {}
