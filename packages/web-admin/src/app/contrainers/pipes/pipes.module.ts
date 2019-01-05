import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
	MatCardModule,
	MatButtonModule,
	MatTableModule
} from '@angular/material';

import { PipesRoutingModule } from './pipes-routing.module';
import { PipesComponent } from './pipes.component';

import { FlowTreeModule } from '@components/flow-tree/flow-tree.module';
import { GroupModule } from './group/group.module';
import { PipeModule } from './pipe/pipe.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		MatCardModule,
		MatButtonModule,
		MatTableModule,
		FlexLayoutModule,

		PipesRoutingModule,

		FlowTreeModule,
		PipeModule,
		GroupModule
	],
	declarations: [
		PipesComponent
	],
	bootstrap: [
		PipesComponent
	]
})

export class PipesModule {}
