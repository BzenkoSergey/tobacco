import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PipesComponent } from './pipes.component';

const routes: Routes = [
	{
		path: '',
		component: PipesComponent,
		children: [
			{
				path: '',
				redirectTo: 'overview'
			},
			{
				path: 'overview',
				loadChildren: './pipes-overview.module#PipesOverviewModule',
				data: {
					breadcrumb: 'Overview'
				}
			},
			{
				path: ':schemeId',
				loadChildren: './pipes-details.module#PipesDetailsModule',
				data: {
					breadcrumb: 'Scheme'
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
export class PipesRoutingModule {}
