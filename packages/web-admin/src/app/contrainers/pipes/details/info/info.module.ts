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

import { PipesDetailsInfoRoutingModule } from './info-routing.module';
import { PipesDetailsInfoComponent } from './info.component';

import { FlowTreeModule } from '@components/flow-tree/flow-tree.module';
import { GroupModule } from './../../group/group.module';
import { PipeModule } from './../../pipe/pipe.module';

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

		PipesDetailsInfoRoutingModule,

		FlowTreeModule,
		PipeModule,
		GroupModule
	],
	declarations: [
		PipesDetailsInfoComponent
	],
	exports: [
		PipesDetailsInfoComponent
	]
})

export class PipesDetailsInfoModule {}
