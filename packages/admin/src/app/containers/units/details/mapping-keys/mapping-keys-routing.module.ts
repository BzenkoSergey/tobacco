import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitsDetailsMappingKeysComponent } from './mapping-keys.component';

const routes: Routes = [
	{
		path: '',
		component: UnitsDetailsMappingKeysComponent
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
export class UnitsDetailsMappingKeysRoutingModule {}
