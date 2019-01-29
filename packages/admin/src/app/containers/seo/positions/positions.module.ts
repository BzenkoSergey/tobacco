import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { SideNavModule } from '@components/side-nav/side-nav.module';

import { SeoPositionsRoutingModule } from './positions-routing.module';
import { SeoPositionsComponent } from './positions.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgbPaginationModule,

		SideNavModule,
		SeoPositionsRoutingModule
	],
	declarations: [
		SeoPositionsComponent
	],
	exports: [
		SeoPositionsComponent
	]
})

export class SeoPositionsModule {}
