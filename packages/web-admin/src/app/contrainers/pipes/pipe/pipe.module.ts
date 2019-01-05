import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
	MatCardModule,
	MatButtonModule,
	MatTableModule
} from '@angular/material';

import { PipeComponent } from './pipe.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		MatCardModule,
		MatButtonModule,
		MatTableModule,
		FlexLayoutModule
	],
	declarations: [
		PipeComponent
	],
	exports: [
		PipeComponent
	]
})

export class PipeModule {}
