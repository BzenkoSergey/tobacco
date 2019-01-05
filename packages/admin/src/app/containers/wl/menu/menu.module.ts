import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		MenuRoutingModule
	],
	declarations: [
		MenuComponent
	],
	exports: [
		MenuComponent
	]
})

export class MenuModule {}
