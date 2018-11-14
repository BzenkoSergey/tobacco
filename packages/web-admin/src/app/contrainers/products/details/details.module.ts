import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';

import { NgxImageEditorModule } from '@components/ngx-image-editor/ngx-image-editor.module';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,
		MatButtonModule,
		NgxImageEditorModule.forRoot(),

		MappingKeysModule,

		DetailsRoutingModule
	],
	declarations: [
		DetailsComponent
	],
	bootstrap: [
		DetailsComponent
	]
})

export class DetailsModule {}
