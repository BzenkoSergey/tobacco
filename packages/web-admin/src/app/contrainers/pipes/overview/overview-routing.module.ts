import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PipesOverviewComponent } from './overview.component';

const routes: Routes = [
	{
		path: '',
		component: PipesOverviewComponent,
		data: {
			breadcrumb: 'Overview'
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
export class PipesOverviewRoutingModule {}
