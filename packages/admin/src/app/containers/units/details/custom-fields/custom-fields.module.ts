import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomFieldsModule } from '@components/custom-fields/custom-fields.module';

import { UnitsDetailsCustomFieldsRoutingModule } from './custom-fields-routing.module';
import { UnitsDetailsCustomFieldsComponent } from './custom-fields.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		CustomFieldsModule,
		UnitsDetailsCustomFieldsRoutingModule
	],
	declarations: [
		UnitsDetailsCustomFieldsComponent
	],
	exports: [
		UnitsDetailsCustomFieldsComponent
	]
})

export class UnitsDetailsCustomFieldsModule {}
