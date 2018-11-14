import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LinksComponent } from './links.component';

const routes: Routes = [
	{
		path: '',
		component: LinksComponent,
		data: {
			breadcrumb: 'Links'
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
export class LinksRoutingModule {}
