import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitsItemsComponent } from './units-items.component';

const routes: Routes = [
	{
		path: '',
		component: UnitsItemsComponent
		// children: [
		// 	{
		// 		path: ':unitId',
		// 		loadChildren: './units-items-details.module#UnitsDetailsModule',
		// 		data: {
		// 			breadcrumb: 'Unit'
		// 		}
		// 	}
		// ]
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
export class UnitsItemsRoutingModule {}
