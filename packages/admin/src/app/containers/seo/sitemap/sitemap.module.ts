import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { MappingKeysModule } from '@components/mapping-keys/mapping-keys.module';
import { ConfirmModule } from '@components/confirm/confirm.module';

import { SitemapRoutingModule } from './sitemap-routing.module';
import { SitemapComponent } from './sitemap.component';
import { UpsertModule } from './upsert/upsert.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		NgbCollapseModule,

		ConfirmModule,
		UpsertModule,
		MappingKeysModule,
		SitemapRoutingModule
	],
	declarations: [
		SitemapComponent
	],
	exports: [
		SitemapComponent
	]
})

export class SitemapModule {}
