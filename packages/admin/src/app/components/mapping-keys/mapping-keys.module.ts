import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MappingKeysComponent } from './mapping-keys.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		MappingKeysComponent
	],
	exports: [
		MappingKeysComponent
	]
})

export class MappingKeysModule {}
