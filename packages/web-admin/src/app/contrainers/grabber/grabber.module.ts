import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { GrabberRoutingModule } from './grabber-routing.module';
import { GrabberComponent } from './grabber.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,

		GrabberRoutingModule
	],
	declarations: [
		GrabberComponent
	],
	bootstrap: [
		GrabberComponent
	]
})

export class GrabberModule {}
