import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResourcesItemsComponent } from './resources-items.component';

const routes: Routes = [
	{
		path: '',
		component: ResourcesItemsComponent,
		data: {
			breadcrumb: 'Resources Items'
		},
		children: [
			{
				path: '',
				redirectTo: 'overview'
			},
			{
				path: 'overview',
				loadChildren: './resources-items-overview.module#OverviewModule'
			},
			{
				path: 'processed',
				loadChildren: './resources-items-processed.module#ProcessedModule',
				data: {
					breadcrumb: 'Processed'
				}
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
export class ResourcesItemsRoutingModule {}
