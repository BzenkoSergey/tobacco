import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		SettingsRoutingModule
	],
	declarations: [
		SettingsComponent
	],
	bootstrap: [
		SettingsComponent
	]
})

export class SettingsModule {}
