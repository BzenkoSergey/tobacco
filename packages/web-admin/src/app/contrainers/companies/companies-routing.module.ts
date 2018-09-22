import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompaniesComponent } from './companies.component';

const routes: Routes = [
	{
		path: '',
		component: CompaniesComponent,
		children: [
			{
				path: '',
				redirectTo: 'overview'
			},
			{
				path: 'overview',
				loadChildren: './companies-overview.module#OverviewModule'
			},
			{
				path: ':companyId',
				loadChildren: './companies-details.module#DetailsModule'
			}
		]
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
export class CompaniesRoutingModule {}
