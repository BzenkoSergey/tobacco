import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MixesRoutingModule } from './mixes-routing.module';
import { MixesComponent } from './mixes.component';

import { BreadcrumbModule } from '@components/breadcrumb/breadcrumb.module';

@NgModule({
	imports: [
		CommonModule,

		MixesRoutingModule,
		BreadcrumbModule
	],
	declarations: [
		MixesComponent
	],
	exports: [
		MixesComponent
	]
})

export class MixesModule {}
