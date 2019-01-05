import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgxImageEditorModule } from '@components/ngx-image-editor/ngx-image-editor.module';

import { UnitsDetailsImagesRoutingModule } from './images-routing.module';
import { UnitsDetailsImagesComponent } from './images.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		NgxImageEditorModule,
		UnitsDetailsImagesRoutingModule
	],
	declarations: [
		UnitsDetailsImagesComponent
	],
	exports: [
		UnitsDetailsImagesComponent
	]
})

export class UnitsDetailsImagesModule {}
