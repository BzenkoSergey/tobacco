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
	MatButtonModule,
	MatSelectModule,
	MatOptionModule,
	MatCheckboxModule,
	MatIconModule,
	MatProgressSpinnerModule
} from '@angular/material';

import { TitleViewModule } from './title-view/title-view.module';
import { OperationsRoutingModule } from './operations-routing.module';
import { OperationsComponent } from './operations.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,
		ScrollingModule,
		MatTabsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MatOptionModule,
		MatCheckboxModule,
		MatIconModule,
		MatProgressSpinnerModule,

		TitleViewModule,
		OperationsRoutingModule
	],
	declarations: [
		OperationsComponent
	],
	bootstrap: [
		OperationsComponent
	]
})

export class OperationsModule {}
