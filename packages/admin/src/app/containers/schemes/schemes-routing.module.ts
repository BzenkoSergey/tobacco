import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SchemesComponent } from './schemes.component';

const routes: Routes = [
	{
		path: '',
		component: SchemesComponent,
		data: {
			breadcrumb: 'Schemes'
		},
		children: [
			{
				path: '',
				redirectTo: 'overview'
			},
			{
				path: 'overview',
				loadChildren: './root-schemes-overview.module#OverviewModule'
			},
			{
				path: 'process/:processId',
				loadChildren: './root-schemes-process.module#ProcessModule',
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
export class SchemesRoutingModule {}
