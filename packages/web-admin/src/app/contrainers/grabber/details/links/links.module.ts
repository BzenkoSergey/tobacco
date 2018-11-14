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

import { LinksRoutingModule } from './links-routing.module';
import { LinksComponent } from './links.component';

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

		LinksRoutingModule
	],
	declarations: [
		LinksComponent
	],
	bootstrap: [
		LinksComponent
	]
})

export class LinksModule {}
