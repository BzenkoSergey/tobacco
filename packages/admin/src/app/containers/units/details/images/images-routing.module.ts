import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitsDetailsImagesComponent } from './images.component';

const routes: Routes = [
	{
		path: '',
		component: UnitsDetailsImagesComponent
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
export class UnitsDetailsImagesRoutingModule {}
