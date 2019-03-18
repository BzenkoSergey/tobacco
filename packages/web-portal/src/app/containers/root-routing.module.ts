import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		data: {
			breadcrumb: 'Home'
		},
		children: [
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full'
			},
			{
				path: 'home',
				loadChildren: './home/home.module#HomeModule'
			},
			{
				path: 'products',
				loadChildren: './products/products.module#ProductsModule'
			},
			{
				path: 'mixes',
				loadChildren: './mixes/mixes.module#MixesModule'
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			paramsInheritanceStrategy: 'always'
			// ,
			// preloadingStrategy: PreloadAllModules
		})
	],
	exports: [
		RouterModule
	]
})
export class RootRoutingModule {}
