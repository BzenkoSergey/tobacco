import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SeoPositionsComponent } from './positions.component';

const routes: Routes = [
	{
		path: '',
		component: SeoPositionsComponent,
		children: [
			{
				path: ':query',
				loadChildren: './positions-details.module#SeoPositionsDetailsModule'
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
export class SeoPositionsRoutingModule {}
