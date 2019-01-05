import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PipesDetailsProcessComponent } from './process.component';

const routes: Routes = [
	{
		path: '',
		component: PipesDetailsProcessComponent
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
export class PipesDetailsProcessRoutingModule {}
