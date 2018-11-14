import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailsComponent } from './details.component';

const routes: Routes = [
	{
		path: '',
		component: DetailsComponent,
		data: {
			breadcrumb: 'Grabber Details'
		},
		children: [
			{
				path: '',
				redirectTo: 'operations'
			},
			{
				path: 'operations',
				loadChildren: './operations/operations.module#OperationsModule'
			},
			{
				path: 'job',
				loadChildren: './job/job.module#JobModule'
			},
			{
				path: 'links',
				loadChildren: './links/links.module#LinksModule'
			},
			{
				path: 'items',
				loadChildren: './items/items.module#ItemsModule'
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
export class DetailsRoutingModule {}
