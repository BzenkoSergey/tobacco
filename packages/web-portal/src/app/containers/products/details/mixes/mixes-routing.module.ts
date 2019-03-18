import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MixesComponent } from './mixes.component';

const routes: Routes = [
	{
		path: '',
		component: MixesComponent
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
export class MixesRoutingModule {}
