import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GrabberComponent } from './grabber.component';

const routes: Routes = [
	{
		path: '',
		component: GrabberComponent,
		data: {
			breadcrumb: 'Grabbers'
		},
		children: [
			{
				path: '',
				redirectTo: 'overview'
			},
			{
				path: 'overview',
				loadChildren: './grabber-overview.module#OverviewModule'
			},
			{
				path: 'settings',
				loadChildren: './settings/settings.module#SettingsModule'
			},
			{
				path: ':marketId',
				loadChildren: './grabber-details.module#DetailsModule'
			}
		]
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
export class GrabberRoutingModule {}
