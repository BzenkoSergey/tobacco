import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbCollapseModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AceEditorModule } from 'ng2-ace-editor';

import { SideNavModule } from '@components/side-nav/side-nav.module';
import { ConfirmModule } from '@components/confirm/confirm.module';
import { FlowTreeModule } from '@components/flow-tree/flow-tree.module';
import { SchemeEditorModule } from '@components/scheme/editor/editor.module';

import { UpsertModule } from './upsert/upsert.module';
import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		NgbCollapseModule,
		NgbModalModule,
		AceEditorModule,

		SchemeEditorModule,
		FlowTreeModule,
		SideNavModule,
		ConfirmModule,

		UpsertModule,
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
