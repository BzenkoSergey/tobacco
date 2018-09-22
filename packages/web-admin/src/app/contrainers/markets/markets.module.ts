import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MarketsRoutingModule } from './markets-routing.module';
import { MarketsComponent } from './markets.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,

		MarketsRoutingModule
	],
	declarations: [
		MarketsComponent
	],
	bootstrap: [
		MarketsComponent
	]
})

export class MarketsModule {}
