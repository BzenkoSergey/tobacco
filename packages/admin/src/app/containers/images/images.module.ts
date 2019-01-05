import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { ImagesRoutingModule } from './images-routing.module';
import { ImagesComponent } from './images.component';

@NgModule({
	imports: [
		CommonModule,
		NgbPaginationModule,

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
