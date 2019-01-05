import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IgnoreLinksComponent } from './ignore-links.component';

const routes: Routes = [
	{
		path: '',
		component: IgnoreLinksComponent,
		data: {
			breadcrumb: 'Ignore Links'
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
export class IgnoreLinksRoutingModule {}
