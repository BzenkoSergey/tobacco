import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PipesDetailsInfoComponent } from './info.component';

const routes: Routes = [
	{
		path: '',
		component: PipesDetailsInfoComponent,
		data: {
			breadcrumb: 'Details'
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
export class PipesDetailsInfoRoutingModule {}
