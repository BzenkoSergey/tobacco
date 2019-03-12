import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitMixesComponent } from './unit-mixes.component';

const routes: Routes = [
	{
		path: '',
		component: UnitMixesComponent,
		data: {
			breadcrumb: 'Unit Mixes'
		},
		children: [
			{
				path: '',
				redirectTo: 'overview'
			},
			{
				path: 'overview',
				loadChildren: './unit-mixes-overview.module#OverviewModule'
			},
			{
				path: ':mixId',
				loadChildren: './unit-mixes-details.module#DetailsModule'
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
export class UnitMixesRoutingModule {}
