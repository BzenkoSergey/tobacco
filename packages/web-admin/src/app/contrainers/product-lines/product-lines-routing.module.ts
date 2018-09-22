import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductLinesComponent } from './product-lines.component';

const routes: Routes = [
	{
		path: '',
		component: ProductLinesComponent,
		children: [
			{
				path: '',
				redirectTo: 'overview'
			},
			{
				path: 'overview',
				loadChildren: './product-lines-overview.module#OverviewModule'
			},
			{
				path: ':companyId',
				loadChildren: './product-lines-details.module#DetailsModule'
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
export class ProductLinesRoutingModule {}
