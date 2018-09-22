import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductAttributesComponent } from './product-attributes.component';

const routes: Routes = [
	{
		path: '',
		component: ProductAttributesComponent,
		children: [
			{
				path: '',
				redirectTo: 'overview'
			},
			{
				path: 'overview',
				loadChildren: './product-attributes-overview.module#OverviewModule'
			},
			{
				path: ':companyId',
				loadChildren: './product-attributes-details.module#DetailsModule'
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
export class ProductAttributesRoutingModule {}
