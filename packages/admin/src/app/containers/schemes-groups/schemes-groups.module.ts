import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbCollapseModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { SideNavModule } from '@components/side-nav/side-nav.module';
import { ConfirmModule } from '@components/confirm/confirm.module';

import { UpsertModule } from './upsert/upsert.module';
import { SchemesGroupsRoutingModule } from './schemes-groups-routing.module';
import { SchemesGroupsComponent } from './schemes-groups.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		NgbCollapseModule,
		NgbModalModule,

		SideNavModule,
		ConfirmModule,

		UpsertModule,
		SchemesGroupsRoutingModule
	],
	declarations: [
		SchemesGroupsComponent
	],
	exports: [
		SchemesGroupsComponent
	]
})

export class SchemesGroupsModule {}
