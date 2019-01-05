import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';

@NgModule({
	imports: [
		CommonModule,

		ResourcesRoutingModule
	],
	declarations: [
		ResourcesComponent
	],
	bootstrap: [
		ResourcesComponent
	]
})

export class ResourcesModule {}
