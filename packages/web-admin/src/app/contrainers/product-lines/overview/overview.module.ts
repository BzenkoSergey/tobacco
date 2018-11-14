import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
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
