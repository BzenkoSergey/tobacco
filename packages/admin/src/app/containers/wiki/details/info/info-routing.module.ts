import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WikiDetailsInfoComponent } from './info.component';

const routes: Routes = [
	{
		path: '',
		component: WikiDetailsInfoComponent
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
export class WikiDetailsInfoRoutingModule {}
