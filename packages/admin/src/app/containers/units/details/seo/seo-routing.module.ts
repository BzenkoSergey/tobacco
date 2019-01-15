import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitsDetailsSeoComponent } from './seo.component';

const routes: Routes = [
	{
		path: '',
		component: UnitsDetailsSeoComponent
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
export class UnitsDetailsSeoRoutingModule {}
