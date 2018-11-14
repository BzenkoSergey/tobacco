import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { JobRoutingModule } from './job-routing.module';
import { JobComponent } from './job.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,

		JobRoutingModule
	],
	declarations: [
		JobComponent
	],
	bootstrap: [
		JobComponent
	]
})

export class JobModule {}
