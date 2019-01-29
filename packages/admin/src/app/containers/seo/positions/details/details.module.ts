import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { SideNavModule } from '@components/side-nav/side-nav.module';

import { SeoPositionsDetailsRoutingModule } from './details-routing.module';
import { SeoPositionsDetailsComponent } from './details.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgbPaginationModule,

		SideNavModule,
		SeoPositionsDetailsRoutingModule
	],
	declarations: [
		SeoPositionsDetailsComponent
	],
	exports: [
		SeoPositionsDetailsComponent
	]
})

export class SeoPositionsDetailsModule {}
