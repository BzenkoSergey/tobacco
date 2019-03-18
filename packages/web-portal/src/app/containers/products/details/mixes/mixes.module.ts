import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

import { MixModule } from '@components/mix/mix.module';
import { IconModule } from '@components/icon/icon.module';

import { MixesRoutingModule } from './mixes-routing.module';
import { MixesComponent } from './mixes.component';

@NgModule({
	imports: [
		CommonModule,
		LazyLoadImageModule.forRoot({
			preset: intersectionObserverPreset
		}),
		MixModule,
		IconModule,
		MixesRoutingModule
	],
	declarations: [
		MixesComponent
	],
	exports: [
		MixesComponent
	]
})

export class MixesModule {}

//node_modules/.bin/ivy-ngcc
