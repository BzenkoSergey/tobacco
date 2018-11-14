import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
	MatTabsModule,
	MatCardModule,
	MatFormFieldModule,
	MatInputModule,
	MatButtonModule
} from '@angular/material';

import { ItemsRoutingModule } from './items-routing.module';
import { ItemsComponent } from './items.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,
		MatTabsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		ScrollingModule,

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
