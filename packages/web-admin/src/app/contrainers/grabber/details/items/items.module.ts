import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ItemsRoutingModule } from './items-routing.module';
import { ItemsComponent } from './items.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,

		ItemsRoutingModule
	],
	declarations: [
		ItemsComponent
	],
	bootstrap: [
		ItemsComponent
	]
})

export class ItemsModule {}
