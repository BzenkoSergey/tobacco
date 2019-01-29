import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SeoRoutingModule } from './seo-routing.module';
import { SeoComponent } from './seo.component';

@NgModule({
	imports: [
		CommonModule,

		SeoRoutingModule
	],
	declarations: [
		SeoComponent
	],
	exports: [
		SeoComponent
	]
})

export class SeoModule {}
