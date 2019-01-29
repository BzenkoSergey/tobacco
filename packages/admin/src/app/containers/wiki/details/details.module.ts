import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { SideNavModule } from '@components/side-nav/side-nav.module';

import { WikiDetailsRoutingModule } from './details-routing.module';
import { WikiDetailsComponent } from './details.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgbPaginationModule,

		SideNavModule,
		WikiDetailsRoutingModule
	],
	declarations: [
		WikiDetailsComponent
	],
	exports: [
		WikiDetailsComponent
	]
})

export class WikiDetailsModule {}
