import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbCollapseModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmModule } from '@components/confirm/confirm.module';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		NgbCollapseModule,
		NgbModalModule,

		ConfirmModule,

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
