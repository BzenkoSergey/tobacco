import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmModule } from '@components/confirm/confirm.module';

import { UpsertModule } from './upsert/upsert.module';
import { IgnoreLinksRoutingModule } from './ignore-links-routing.module';
import { IgnoreLinksComponent } from './ignore-links.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		ConfirmModule,
		UpsertModule,
		IgnoreLinksRoutingModule
	],
	declarations: [
		IgnoreLinksComponent
	],
	bootstrap: [
		IgnoreLinksComponent
	]
})

export class IgnoreLinksModule {}
