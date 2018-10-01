import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from './products.component';

const routes: Routes = [
	{
		path: '',
		component: ProductsComponent,
		data: {
			breadcrumb: 'Products'
		},
		children: [
			{
				path: '',
				redirectTo: 'overview'
			},
			{
				path: 'overview',
				loadChildren: './products-overview.module#OverviewModule'
			},
			{
				path: ':companyId',
				loadChildren: './products-details.module#DetailsModule'
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
export class ProductsRoutingModule {}
