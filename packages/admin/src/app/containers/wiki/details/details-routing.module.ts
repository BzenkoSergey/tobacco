import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WikiDetailsComponent } from './details.component';

const routes: Routes = [
	{
		path: '',
		component: WikiDetailsComponent,
		children: [
			{
				path: '',
				redirectTo: 'info'
			},
			{
				path: 'info',
				loadChildren: './wiki-details-info.module#WikiDetailsInfoModule',
				data: {
					breadcrumb: 'Information'
				}
			},
			{
				path: 'fields',
				loadChildren: './wiki-details-fields.module#WikiDetailsFieldsModule',
				data: {
					breadcrumb: 'Fields'
				}
			},
			{
				path: 'mapping',
				loadChildren: './wiki-details-mapping.module#WikiDetailsMappingModule',
				data: {
					breadcrumb: 'Mapping'
				}
			},
			{
				path: 'meta',
				loadChildren: './wiki-details-meta.module#WikiDetailsMetaModule',
				data: {
					breadcrumb: 'Meta'
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
export class WikiDetailsRoutingModule {}
