import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TitleViewComponent } from './title-view.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		TitleViewComponent
	],
	exports: [
		TitleViewComponent
	]
})

export class TitleViewModule {}
