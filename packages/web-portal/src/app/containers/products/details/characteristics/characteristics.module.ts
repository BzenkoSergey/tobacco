import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

import { CharacteristicsRoutingModule } from './characteristics-routing.module';
import { CharacteristicsComponent } from './characteristics.component';

@NgModule({
	imports: [
		CommonModule,
		LazyLoadImageModule.forRoot({
			preset: intersectionObserverPreset
		}),
		CharacteristicsRoutingModule
	],
	declarations: [
		CharacteristicsComponent
	],
	exports: [
		CharacteristicsComponent
	]
})

export class CharacteristicsModule {}

//node_modules/.bin/ivy-ngcc
