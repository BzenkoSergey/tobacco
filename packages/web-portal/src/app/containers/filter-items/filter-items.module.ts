import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FilterItemsComponent } from './filter-items.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,
	],
	declarations: [
		FilterItemsComponent
	],
	exports: [
		FilterItemsComponent
	]
})

export class FilterItemsModule {}
