import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ResourcesItemsRoutingModule } from './resources-items-routing.module';
import { ResourcesItemsComponent } from './resources-items.component';

@NgModule({
	imports: [
		CommonModule,

		ResourcesItemsRoutingModule
	],
	declarations: [
		ResourcesItemsComponent
	],
	exports: [
		ResourcesItemsComponent
	]
})

export class ResourcesItemsModule {}
