import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MixesComponent } from './mixes.component';

const routes: Routes = [
	{
		path: '',
		component: MixesComponent,
		data: {
			breadcrumb: 'Mixes'
		},
		children: [
			// {
			// 	path: '',
			// 	redirectTo: 'overview',
			// 	pathMatch: 'full'
			// },

			// detail
			{
				path: 'detail/:unitCode',
				loadChildren: './mixes-details.module#DetailsModule'
			},
			{
				path: 'detail/:unitCode',
				loadChildren: './mixes-details.module#DetailsModule'
			},
			{
				path: ':company/detail/:unitCode',
				loadChildren: './mixes-details.module#DetailsModule'
			},
			{
				path: ':company/:unit-line/detail/:unitCode',
				loadChildren: './mixes-details.module#DetailsModule'
			},

			// overview
			{
				path: '',
				loadChildren: './mixes-overview.module#OverviewModule'
			},
			{
				path: ':company',
				loadChildren: './mixes-overview.module#OverviewModule'
			},
			{
				path: ':company/:unit-line',
				loadChildren: './mixes-overview.module#OverviewModule'
			}

			// category/company/line/product
			// category/company/product
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
export class MixesRoutingModule {}
