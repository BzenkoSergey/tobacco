import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbCollapseModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { SideNavModule } from '@components/side-nav/side-nav.module';
import { ConfirmModule } from '@components/confirm/confirm.module';

import { ProcessedRoutingModule } from './processed-routing.module';
import { ProcessedComponent } from './processed.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		NgbCollapseModule,
		NgbModalModule,

		SideNavModule,
		ConfirmModule,

		ProcessedRoutingModule
	],
	declarations: [
		ProcessedComponent
	],
	bootstrap: [
		ProcessedComponent
	]
})

export class ProcessedModule {}
