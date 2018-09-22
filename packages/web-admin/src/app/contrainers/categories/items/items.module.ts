import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CategoriesItemsComponent } from './items.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule
	],
	declarations: [
		CategoriesItemsComponent
	],
	exports: [
		CategoriesItemsComponent
	]
})

export class CategoriesItemsModule {}
