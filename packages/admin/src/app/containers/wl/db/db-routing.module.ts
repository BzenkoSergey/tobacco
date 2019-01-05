import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DbComponent } from './db.component';

const routes: Routes = [
	{
		path: '',
		component: DbComponent
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
export class DbRoutingModule {}
