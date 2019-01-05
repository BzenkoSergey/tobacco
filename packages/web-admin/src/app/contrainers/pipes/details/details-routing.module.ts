import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PipesDetailsComponent } from './details.component';

const routes: Routes = [
	{
		path: '',
		component: PipesDetailsComponent,
		data: {
			breadcrumb: 'Scheme'
		},
		children: [
			{
				path: '',
				redirectTo: 'info'
			},
			{
				path: 'info',
				loadChildren: './details-info.module#PipesDetailsInfoModule',
				data: {
					breadcrumb: 'Info'
				}
			}
			,
			{
				path: 'process/:processId',
				loadChildren: './details-process.module#PipesDetailsProcessModule',
				data: {
					breadcrumb: 'Process'
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
export class PipesDetailsRoutingModule {}
