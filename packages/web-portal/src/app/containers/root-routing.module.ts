import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './shared/reuse-strategy';
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
			initialNavigation: 'enabled',
			paramsInheritanceStrategy: 'always'
			// ,
			// preloadingStrategy: PreloadAllModules
		})
	],
	exports: [
		RouterModule
	],
	providers: [
		{provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
	]
})
export class RootRoutingModule {}
