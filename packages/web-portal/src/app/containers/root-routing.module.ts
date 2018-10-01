import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RootComponent } from './root.component';

const routes: Routes = [
	{
		path: '',
		data: {
			breadcrumb: 'Home'
		},
		component: RootComponent
		// ,
		// children: [
		// 	{
		// 		path: '',
		// 		redirectTo: 'markets',
		// 		pathMatch: 'full'
		// 	},
		// 	{
		// 		path: 'markets',
		// 		loadChildren: './markets/markets.module#MarketsModule'
		// 	},
		// 	{
		// 		path: 'market-products',
		// 		loadChildren: './market-products/market-products.module#MarketProductsModule'
		// 	},
		// 	{
		// 		path: 'grabber',
		// 		loadChildren: './grabber/grabber.module#GrabberModule'
		// 	},
		// 	{
		// 		path: 'companies',
		// 		loadChildren: './companies/companies.module#CompaniesModule'
		// 	},
		// 	{
		// 		path: 'product-lines',
		// 		loadChildren: './product-lines/product-lines.module#ProductLinesModule'
		// 	},
		// 	{
		// 		path: 'product-attributes',
		// 		loadChildren: './product-attributes/product-attributes.module#ProductAttributesModule'
		// 	},
		// 	{
		// 		path: 'products',
		// 		loadChildren: './products/products.module#ProductsModule'
		// 	},
		// 	{
		// 		path: 'categories',
		// 		loadChildren: './categories/categories.module#CategoriesModule'
		// 	}
		// ]
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			paramsInheritanceStrategy: 'always'
		})
	],
	exports: [
		RouterModule
	]
})
export class RootRoutingModule {}
