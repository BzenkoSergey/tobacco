import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomFieldsComponent } from './custom-fields.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		CustomFieldsComponent
	],
	exports: [
		CustomFieldsComponent
	]
})

export class CustomFieldsModule {}
