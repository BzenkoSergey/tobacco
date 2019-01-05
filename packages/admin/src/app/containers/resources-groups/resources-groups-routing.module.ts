import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResourcesGroupsComponent } from './resources-groups.component';

const routes: Routes = [
	{
		path: '',
		component: ResourcesGroupsComponent,
		data: {
			breadcrumb: 'Resources Group'
		},
		children: [
			{
				path: '',
				redirectTo: 'overview'
			},
			{
				path: 'overview',
				loadChildren: './resources-groups-overview.module#OverviewModule'
			},
			{
				path: ':companyId',
				loadChildren: './resources-groups-details.module#DetailsModule'
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
export class ResourcesGroupsRoutingModule {}
