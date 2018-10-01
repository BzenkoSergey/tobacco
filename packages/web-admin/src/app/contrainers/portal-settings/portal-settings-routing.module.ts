import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PortalSettingsComponent } from './portal-settings.component';

const routes: Routes = [
	{
		path: '',
		component: PortalSettingsComponent,
		data: {
			breadcrumb: 'Portal Settings'
		}
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class PortalSettingsRoutingModule {}
