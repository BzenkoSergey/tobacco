import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IconModule } from '@components/icon/icon.module';
import { FilterItemsComponent } from './filter-items.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,

		IconModule
	],
	declarations: [
		FilterItemsComponent
	],
	exports: [
		FilterItemsComponent
	]
})

export class FilterItemsModule {}
