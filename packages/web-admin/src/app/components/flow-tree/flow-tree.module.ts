import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FlowTreeComponent } from './flow-tree.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule,
		FlexLayoutModule,
	],
	declarations: [
		FlowTreeComponent
	],
	exports: [
		FlowTreeComponent
	]
})

export class FlowTreeModule {}
