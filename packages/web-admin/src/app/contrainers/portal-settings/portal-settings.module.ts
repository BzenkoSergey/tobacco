import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PortalSettingsRoutingModule } from './portal-settings-routing.module';
import { PortalSettingsComponent } from './portal-settings.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,

		PortalSettingsRoutingModule
	],
	declarations: [
		PortalSettingsComponent
	],
	bootstrap: [
		PortalSettingsComponent
	]
})

export class PortalSettingsModule {}
