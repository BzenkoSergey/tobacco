import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SchemeEditorModule } from '@components/scheme/editor/editor.module';

import { ToolsRoutingModule } from './tools-routing.module';
import { ToolsComponent } from './tools.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		SchemeEditorModule,
		ToolsRoutingModule
	],
	declarations: [
		ToolsComponent
	],
	exports: [
		ToolsComponent
	]
})

export class ToolsModule {}
