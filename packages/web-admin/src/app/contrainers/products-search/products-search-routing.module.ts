import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsSearchComponent } from './products-search.component';

const routes: Routes = [
	{
		path: '',
		component: ProductsSearchComponent,
		data: {
			breadcrumb: 'products-search'
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
export class ProductsSearchRoutingModule {}
