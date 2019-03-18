import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsRestService } from '@rest/products';

import { DetailsComponent } from './details.component';
import { DetailsResolver } from './details.resolve';

const routes: Routes = [
	{
		path: '',
		component: DetailsComponent,
		resolve: {
			unit: DetailsResolver
		},
		children: [
			{
				path: '',
				loadChildren: './info/info.module#InfoModule'
			},
			{
				path: 'prices',
				loadChildren: './prices/prices.module#PricesModule'
			},
			{
				path: 'characteristics',
				loadChildren: './characteristics/characteristics.module#CharacteristicsModule'
			},
			{
				path: 'mixes',
				loadChildren: './details-mixes.module#MixesModule'
			},
			{
				path: 'reviews',
				loadChildren: './details-reviews.module#ReviewsModule'
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
	],
	providers: [
		ProductsRestService,
		DetailsResolver
	]
})
export class DetailsRoutingModule {}
