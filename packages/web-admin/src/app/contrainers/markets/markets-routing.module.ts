import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MarketsComponent } from './markets.component';

const routes: Routes = [
	{
		path: '',
		component: MarketsComponent,
		children: [
			{
				path: '',
				redirectTo: 'overview'
			},
			{
				path: 'overview',
				loadChildren: './overview/overview.module#OverviewModule'
			},
			{
				path: ':marketId',
				loadChildren: './details/details.module#DetailsModule'
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
export class MarketsRoutingModule {}
