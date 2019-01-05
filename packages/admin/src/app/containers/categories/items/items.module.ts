import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoriesItemsComponent } from './items.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		CategoriesItemsComponent
	],
	exports: [
		CategoriesItemsComponent
	]
})

export class CategoriesItemsModule {}
