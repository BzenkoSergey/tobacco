import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

import { MixComponent } from './mix.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,

		LazyLoadImageModule.forRoot({
			preset: intersectionObserverPreset
		})
	],
	declarations: [
		MixComponent
	],
	exports: [
		MixComponent
	]
})

export class MixModule {}
