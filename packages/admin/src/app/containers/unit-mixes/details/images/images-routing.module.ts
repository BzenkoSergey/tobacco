import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailsImagesComponent } from './images.component';

const routes: Routes = [
	{
		path: '',
		component: DetailsImagesComponent
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
export class DetailsImagesRoutingModule {}
