import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SearchComponent } from './search.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		SearchComponent
	],
	exports: [
		SearchComponent
	]
})

export class SearchModule {}
