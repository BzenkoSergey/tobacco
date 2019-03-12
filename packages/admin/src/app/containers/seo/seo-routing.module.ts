import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SeoComponent } from './seo.component';

const routes: Routes = [
	{
		path: '',
		component: SeoComponent,
		children: [
			{
				path: '',
				redirectTo: 'positions',
				pathMatch: 'full'
			},
			{
				path: 'positions',
				loadChildren: './seo-positions.module#SeoPositionsModule',
				data: {
					breadcrumb: 'Positions'
				}
			},
			{
				path: 'sitemap',
				loadChildren: './seo-sitemap.module#SitemapModule',
				data: {
					breadcrumb: 'Sitemap'
				}
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
export class SeoRoutingModule {}
