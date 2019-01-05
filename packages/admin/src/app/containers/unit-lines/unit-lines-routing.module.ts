import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitLinesComponent } from './unit-lines.component';

const routes: Routes = [
	{
		path: '',
		component: UnitLinesComponent,
		data: {
			breadcrumb: 'Unit Lines'
		}
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
export class UnitLinesRoutingModule {}
