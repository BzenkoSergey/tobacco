import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgxImageEditorModule } from '@components/ngx-image-editor/ngx-image-editor.module';

import { DetailsImagesRoutingModule } from './images-routing.module';
import { DetailsImagesComponent } from './images.component';
import { PieModule } from '@components/pie/pie.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		PieModule,
		NgxImageEditorModule,
		DetailsImagesRoutingModule
	],
	declarations: [
		DetailsImagesComponent
	],
	exports: [
		DetailsImagesComponent
	]
})

export class DetailsImagesModule {}
