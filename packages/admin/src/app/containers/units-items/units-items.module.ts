import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { SideNavModule } from '@components/side-nav/side-nav.module';

import { UnitsItemsRoutingModule } from './units-routing.module';
import { UnitsItemsComponent } from './units-items.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgbPaginationModule,

		SideNavModule,
		UnitsItemsRoutingModule
	],
	declarations: [
		UnitsItemsComponent
	],
	exports: [
		UnitsItemsComponent
	]
})

export class UnitsItemsModule {}
