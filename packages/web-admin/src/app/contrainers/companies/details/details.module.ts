import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,

		MappingKeysModule,

		DetailsRoutingModule
	],
	declarations: [
		DetailsComponent
	],
	bootstrap: [
		DetailsComponent
	]
})

export class DetailsModule {}
