import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { SideNavModule } from '@components/side-nav/side-nav.module';

import { WikiRoutingModule } from './wiki-routing.module';
import { WikiComponent } from './wiki.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgbPaginationModule,

		SideNavModule,
		WikiRoutingModule
	],
	declarations: [
		WikiComponent
	],
	exports: [
		WikiComponent
	]
})

export class WikiModule {}
