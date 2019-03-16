import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitsDetailsReviewsComponent } from './reviews.component';

const routes: Routes = [
	{
		path: '',
		component: UnitsDetailsReviewsComponent
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
export class UnitsDetailsReviewsRoutingModule {}
