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
