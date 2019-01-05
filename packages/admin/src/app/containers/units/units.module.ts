import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SideNavModule } from '@components/side-nav/side-nav.module';

import { UnitsRoutingModule } from './units-routing.module';
import { UnitsComponent } from './units.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		SideNavModule,
		UnitsRoutingModule
	],
	declarations: [
		UnitsComponent
	],
	exports: [
		UnitsComponent
	]
})

export class UnitsModule {}
