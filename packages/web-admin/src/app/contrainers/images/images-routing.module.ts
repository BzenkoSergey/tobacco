import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ImagesComponent } from './images.component';

const routes: Routes = [
	{
		path: '',
		component: ImagesComponent,
		data: {
			breadcrumb: 'Images'
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
export class ImagesRoutingModule {}
