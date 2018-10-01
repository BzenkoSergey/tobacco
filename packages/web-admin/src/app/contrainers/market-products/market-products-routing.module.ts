import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MarketProductsComponent } from './market-products.component';

const routes: Routes = [
	{
		path: '',
		component: MarketProductsComponent,
		data: {
			breadcrumb: 'Market Products'
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
export class MarketProductsRoutingModule {}
