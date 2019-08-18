import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MixModule } from '@components/mix/mix.module';
import { IconModule } from '@components/icon/icon.module';

import { NavigationModule } from './../shared/navigation/navigation.module';

import { MixesRoutingModule } from './mixes-routing.module';
import { MixesComponent } from './mixes.component';

@NgModule({
	imports: [
		CommonModule,
		MixModule,
		IconModule,
		MixesRoutingModule,
		NavigationModule
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
