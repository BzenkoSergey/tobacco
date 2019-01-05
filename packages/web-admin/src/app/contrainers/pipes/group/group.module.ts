import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
	MatCardModule,
	MatButtonModule,
	MatTableModule
} from '@angular/material';

import { PipeModule } from './../pipe/pipe.module';
import { GroupComponent } from './group.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		MatCardModule,
		MatButtonModule,
		MatTableModule,
		FlexLayoutModule,

		PipeModule
	],
	declarations: [
		GroupComponent
	],
	exports: [
		GroupComponent
	]
})

export class GroupModule {}
