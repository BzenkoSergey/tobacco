import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResourcesComponent } from './resources.component';

const routes: Routes = [
	{
		path: '',
		component: ResourcesComponent,
		data: {
			breadcrumb: 'Resources'
		},
		children: [
			{
				path: '',
				redirectTo: 'overview'
			},
			{
				path: 'overview',
				loadChildren: './resources-overview.module#OverviewModule'
			},
			{
				path: ':resourceId',
				loadChildren: './resources-details.module#DetailsModule'
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
export class ResourcesRoutingModule {}
