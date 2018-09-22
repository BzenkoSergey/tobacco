import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MappingKeysComponent } from './mapping-keys.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule,
		FlexLayoutModule,
	],
	declarations: [
		MappingKeysComponent
	],
	exports: [
		MappingKeysComponent
	]
})

export class MappingKeysModule {}
