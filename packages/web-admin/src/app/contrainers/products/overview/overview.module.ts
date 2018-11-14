import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,

		OverviewRoutingModule
	],
	declarations: [
		OverviewComponent
	],
	bootstrap: [
		OverviewComponent
	]
})

export class OverviewModule {}
