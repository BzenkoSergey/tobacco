import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OperationsComponent } from './operations.component';

const routes: Routes = [
	{
		path: '',
		component: OperationsComponent,
		data: {
			breadcrumb: 'Operations'
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
export class OperationsRoutingModule {}
