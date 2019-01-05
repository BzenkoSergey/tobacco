import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ResourcesGroupsRoutingModule } from './resources-groups-routing.module';
import { ResourcesGroupsComponent } from './resources-groups.component';

@NgModule({
	imports: [
		CommonModule,

		ResourcesGroupsRoutingModule
	],
	declarations: [
		ResourcesGroupsComponent
	],
	bootstrap: [
		ResourcesGroupsComponent
	]
})

export class ResourcesGroupsModule {}
