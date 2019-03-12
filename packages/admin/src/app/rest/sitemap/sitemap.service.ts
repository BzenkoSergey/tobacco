import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from '../pipes/pipes.service';
import { SitemapDto } from './sitemap.dto';

@Injectable()
export class SitemapRestService {
	constructor(private restService: PipeRestService) {}

	list() {
		return this.restService
			.runSchemeOptions<SitemapDto[], any>(
				'GETEXT_LIST',
				{
					collection: 'sitemap',
					query: {},
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new SitemapDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<SitemapDto, any>(
				'GETEXT',
				{
					collection: 'sitemap',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(d => {
					return new SitemapDto(d);
				})
			);
	}

	create(d: SitemapDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATEEXT',
				{
					collection: 'sitemap',
					document: d,
					modes: ['DB_NO_SYNC']
				}
			);
	}

	update(id: string, d: SitemapDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATEEXT',
				{
					collection: 'sitemap',
					id: id,
					document: d,
					modes: ['DB_NO_SYNC']
				}
			);
	}

	remove(id: string) {
		return this.restService
			.runSchemeOptions<number, any>(
				'REMOVEEXT',
				{
					collection: 'sitemap',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			);
	}
}
