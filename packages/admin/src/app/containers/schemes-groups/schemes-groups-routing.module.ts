import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SchemesGroupsComponent } from './schemes-groups.component';

const routes: Routes = [
	{
		path: '',
		component: SchemesGroupsComponent,
		data: {
			breadcrumb: 'Schemes'
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
export class SchemesGroupsRoutingModule {}
