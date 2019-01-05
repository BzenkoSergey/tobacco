import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from '../pipes/pipes.service';
import { CompanyDto } from './company.dto';

@Injectable()
export class CompaniesRestService {
	constructor(private restService: PipeRestService) {}

	list() {
		return this.restService
			.runSchemeOptions<CompanyDto[], any>(
				'GETEXT_LIST',
				{
					collection: 'companies',
					query: {}
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new CompanyDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<CompanyDto, any>(
				'GETEXT',
				{
					collection: 'companies',
					id: id
				}
			)
			.pipe(
				map(d => {
					return new CompanyDto(d);
				})
			);
	}

	create(d: CompanyDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATEEXT',
				{
					collection: 'companies',
					document: d
				}
			);
	}

	update(id: string, d: CompanyDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATEEXT',
				{
					collection: 'companies',
					id: id,
					document: d
				}
			);
	}

	remove(id: string) {
		return this.restService
			.runSchemeOptions<number, any>(
				'REMOVEEXT',
				{
					collection: 'companies',
					id: id
				}
			);
	}
}
