import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				redirectTo: 'markets',
				pathMatch: 'full'
			},
			{
				path: 'markets',
				loadChildren: './markets/markets.module#MarketsModule'
			},
			{
				path: 'grabber',
				loadChildren: './grabber/grabber.module#GrabberModule'
			},
			{
				path: 'companies',
				loadChildren: './companies/companies.module#CompaniesModule'
			},
			{
				path: 'product-lines',
				loadChildren: './product-lines/product-lines.module#ProductLinesModule'
			},
			{
				path: 'product-attributes',
				loadChildren: './product-attributes/product-attributes.module#ProductAttributesModule'
			},
			{
				path: 'categories',
				loadChildren: './categories/categories.module#CategoriesModule'
			}
		]
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
