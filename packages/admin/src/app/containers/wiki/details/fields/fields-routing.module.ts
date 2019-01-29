import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WikiDetailsFieldsComponent } from './fields.component';

const routes: Routes = [
	{
		path: '',
		component: WikiDetailsFieldsComponent
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
export class WikiDetailsFieldsRoutingModule {}
