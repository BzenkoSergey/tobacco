import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { NavigationModule } from './../shared/navigation/navigation.module';

import { CharacteristicsRoutingModule } from './characteristics-routing.module';
import { CharacteristicsComponent } from './characteristics.component';

@NgModule({
	imports: [
		CommonModule,
		LazyLoadImageModule,

		CharacteristicsRoutingModule,
		NavigationModule
	],
	declarations: [
		CharacteristicsComponent
	],
	exports: [
		CharacteristicsComponent
	]
})

export class CharacteristicsModule {}
