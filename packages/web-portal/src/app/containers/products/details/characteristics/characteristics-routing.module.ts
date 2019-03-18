import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CharacteristicsComponent } from './characteristics.component';

const routes: Routes = [
	{
		path: '',
		component: CharacteristicsComponent
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
export class CharacteristicsRoutingModule {}
