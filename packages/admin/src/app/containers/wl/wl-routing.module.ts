import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WlComponent } from './wl.component';

const routes: Routes = [
	{
		path: '',
		component: WlComponent,
		children: [
			{
				path: '',
				redirectTo: 'db'
			},
			{
				path: 'db',
				loadChildren: './wl-db.module#DbModule',
				data: {
					breadcrumb: 'Data Base'
				}
			},
			{
				path: 'menu',
				loadChildren: './wl-menu.module#MenuModule',
				data: {
					breadcrumb: 'Menu'
				}
			},
			{
				path: 'tools',
				loadChildren: './wl-tools.module#ToolsModule',
				data: {
					breadcrumb: 'Tools'
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
export class WlRoutingModule {}
