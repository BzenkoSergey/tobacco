import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StructuresComponent } from './structures.component';

const routes: Routes = [
	{
		path: '',
		component: StructuresComponent,
		data: {
			breadcrumb: 'Structures'
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
export class StructuresRoutingModule {}
