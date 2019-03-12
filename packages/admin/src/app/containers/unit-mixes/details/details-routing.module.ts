import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailsComponent } from './details.component';

const routes: Routes = [
	{
		path: '',
		component: DetailsComponent,
		children: [
			{
				path: '',
				redirectTo: 'info'
			},
			{
				path: 'info',
				loadChildren: './mix-details-info.module#DetailsInfoModule',
				data: {
					breadcrumb: 'Information'
				}
			},
			{
				path: 'images',
				loadChildren: './mix-details-images.module#DetailsImagesModule',
				data: {
					breadcrumb: 'Information'
				}
			}
		]
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
export class DetailsRoutingModule {}
