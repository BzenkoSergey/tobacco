import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SeoPositionsDetailsComponent } from './details.component';

const routes: Routes = [
	{
		path: '',
		component: SeoPositionsDetailsComponent
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
export class SeoPositionsDetailsRoutingModule {}
