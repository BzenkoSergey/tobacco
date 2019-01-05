import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FlowTreeComponent } from './flow-tree.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule
	],
	declarations: [
		FlowTreeComponent
	],
	exports: [
		FlowTreeComponent
	]
})

export class FlowTreeModule {}
