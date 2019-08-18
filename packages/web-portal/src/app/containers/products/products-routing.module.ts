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
			// detail
			{
				path: 'detail/:unitCode',
				loadChildren: './details/details.module#DetailsModule'
			},
			{
				path: ':resource/detail/:unitCode',
				loadChildren: './details/details.module#DetailsModule'
			},
			{
				path: ':resource/:category/detail/:unitCode',
				loadChildren: './details/details.module#DetailsModule'
			},
			{
				path: ':resource/:category/:company/detail/:unitCode',
				loadChildren: './details/details.module#DetailsModule'
			},
			{
				path: ':resource/:category/:company/:unit-line/detail/:unitCode',
				loadChildren: './details/details.module#DetailsModule'
			},
			{
				path: ':resource/:category/:company/:unit-line/:WEIGHT/detail/:unitCode',
				loadChildren: './details/details.module#DetailsModule'
			},

			// overview
			{
				path: '',
				loadChildren: './overview/overview.module#OverviewModule'
			},
			{
				path: ':resource',
				loadChildren: './overview/overview.module#OverviewModule'
			},
			{
				path: ':resource/:category',
				loadChildren: './overview/overview.module#OverviewModule'
			},
			{
				path: ':resource/:category/:company',
				loadChildren: './overview/overview.module#OverviewModule'
			},
			{
				path: ':resource/:category/:company/:unit-line',
				loadChildren: './overview/overview.module#OverviewModule'
			},
			{
				path: ':resource/:category/:company/:unit-line/:WEIGHT',
				loadChildren: './overview/overview.module#OverviewModule'
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
