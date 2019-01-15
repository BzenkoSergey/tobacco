import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitsDetailsComponent } from './details.component';

const routes: Routes = [
	{
		path: '',
		component: UnitsDetailsComponent,
		children: [
			{
				path: '',
				redirectTo: 'info'
			},
			{
				path: 'info',
				loadChildren: './units-details-info.module#UnitsDetailsInfoModule',
				data: {
					breadcrumb: 'Information'
				}
			},
			{
				path: 'mapping-keys',
				loadChildren: './units-details-mapping-keys.module#UnitsDetailsMappingKeysModule',
				data: {
					breadcrumb: 'Mapping Keys'
				}
			},
			{
				path: 'images',
				loadChildren: './units-details-images.module#UnitsDetailsImagesModule',
				data: {
					breadcrumb: 'Images'
				}
			},
			{
				path: 'seo',
				loadChildren: './units-details-seo.module#UnitsDetailsSeoModule',
				data: {
					breadcrumb: 'SEO'
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
export class UnitsDetailsRoutingModule {}
