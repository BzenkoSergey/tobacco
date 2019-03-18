import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IconModule } from '@components/icon/icon.module';
import { NavigationComponent } from './navigation.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		IconModule
	],
	declarations: [
		NavigationComponent
	],
	exports: [
		NavigationComponent
	]
})

export class NavigationModule {}

