import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WikiDetailsMappingComponent } from './mapping.component';

const routes: Routes = [
	{
		path: '',
		component: WikiDetailsMappingComponent
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
export class WikiDetailsMappingRoutingModule {}
