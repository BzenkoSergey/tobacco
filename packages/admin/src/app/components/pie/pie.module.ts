import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PieComponent } from './pie.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule
	],
	declarations: [
		PieComponent
	],
	exports: [
		PieComponent
	]
})

export class PieModule {}
