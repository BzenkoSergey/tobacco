import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { CategoriesItemsModule } from './items/items.module';
import { CaregoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		CategoriesItemsModule,
		MappingKeysModule,
		CaregoriesRoutingModule
	],
	declarations: [
		CategoriesComponent
	],
	bootstrap: [
		CategoriesComponent
	]
})

export class CategoriesModule {}
