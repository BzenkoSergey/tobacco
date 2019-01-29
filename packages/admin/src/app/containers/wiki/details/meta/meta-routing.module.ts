import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WikiDetailsMetaComponent } from './meta.component';

const routes: Routes = [
	{
		path: '',
		component: WikiDetailsMetaComponent
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
export class WikiDetailsMetaRoutingModule {}
