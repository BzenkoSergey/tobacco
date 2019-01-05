import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitAttributesComponent } from './unit-attributes.component';

const routes: Routes = [
	{
		path: '',
		component: UnitAttributesComponent,
		data: {
			breadcrumb: 'Unit Attributes'
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
export class UnitAttributesRoutingModule {}
