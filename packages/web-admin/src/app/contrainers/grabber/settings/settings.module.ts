import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
	MatCardModule,
	MatButtonModule,
	MatFormFieldModule,
	MatInputModule
} from '@angular/material';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,

		MatCardModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,

		SettingsRoutingModule
	],
	declarations: [
		SettingsComponent
	],
	exports: [
		SettingsComponent
	]
})

export class SettingsModule {}
