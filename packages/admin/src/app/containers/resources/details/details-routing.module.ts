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
				loadChildren: './details-info.module#InfoModule',
				data: {
					breadcrumb: 'Information'
				}
			},
			{
				path: 'structures',
				loadChildren: './details-structures.module#StructuresModule',
				data: {
					breadcrumb: 'Structures'
				}
			},
			{
				path: 'ignore-links',
				loadChildren: './details-ignore-links.module#IgnoreLinksModule',
				data: {
					breadcrumb: 'Ignore Links'
				}
			},
			{
				path: 'schemes',
				loadChildren: './details-schemes.module#SchemesModule',
				data: {
					breadcrumb: 'Schemes'
				}
			},
			{
				path: 'settings',
				loadChildren: './details-settings.module#SettingsModule',
				data: {
					breadcrumb: 'Settings'
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
