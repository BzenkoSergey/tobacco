import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NavigationModule } from './shared/navigation/navigation.module';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';

@NgModule({
	imports: [
		CommonModule,

		NavigationModule,
		DetailsRoutingModule
	],
	declarations: [
		DetailsComponent
	],
	exports: [
		DetailsComponent
	]
})

export class DetailsModule {}
