import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitsComponent } from './units.component';

const routes: Routes = [
	{
		path: '',
		component: UnitsComponent,
		children: [
			{
				path: ':unitId',
				loadChildren: './units-details.module#UnitsDetailsModule',
				data: {
					breadcrumb: 'Unit'
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
export class UnitsRoutingModule {}
