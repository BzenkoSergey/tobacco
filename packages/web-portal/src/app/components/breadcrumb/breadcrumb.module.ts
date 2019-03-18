import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IconModule } from './../icon/icon.module';
import { BreadcrumbComponent } from './breadcrumb.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,

		IconModule
	],
	declarations: [
		BreadcrumbComponent
	],
	exports: [
		BreadcrumbComponent
	]
})

export class BreadcrumbModule {}
