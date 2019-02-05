import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitsDetailsCustomFieldsComponent } from './custom-fields.component';

const routes: Routes = [
	{
		path: '',
		component: UnitsDetailsCustomFieldsComponent
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
export class UnitsDetailsCustomFieldsRoutingModule {}
