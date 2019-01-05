import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProcessedComponent } from './processed.component';

const routes: Routes = [
	{
		path: '',
		component: ProcessedComponent
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
export class ProcessedRoutingModule {}
