import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule, MatGridListModule, MatCardModule } from '@angular/material';

import { ImagesRoutingModule } from './images-routing.module';
import { ImagesComponent } from './images.component';

@NgModule({
	imports: [
		CommonModule,
		MatPaginatorModule,
		MatButtonModule,
		MatGridListModule,
		MatCardModule,
		FlexLayoutModule,

		ImagesRoutingModule
	],
	declarations: [
		ImagesComponent
	],
	exports: [
		ImagesComponent
	]
})

export class ImagesModule {}
