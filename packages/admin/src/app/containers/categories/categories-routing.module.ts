import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriesComponent } from './categories.component';

const routes: Routes = [
	{
		path: '',
		component: CategoriesComponent,
		data: {
			breadcrumb: 'Categories'
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
export class CaregoriesRoutingModule {}
