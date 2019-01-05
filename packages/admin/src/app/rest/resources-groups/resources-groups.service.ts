import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from './../pipes/pipes.service';
import { ResourceGroupDto } from './resource-group.dto';

@Injectable()
export class ResourcesGroupsRestService {
	constructor(private restService: PipeRestService) {}

	list() {
		return this.restService
			.runSchemeOptions<ResourceGroupDto[], any>(
				'GET_LIST',
				{
					collection: 'resource-group',
					query: {}
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new ResourceGroupDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<ResourceGroupDto, any>(
				'GET',
				{
					collection: 'resource-group',
					id: id
				}
			)
			.pipe(
				map(d => {
					return new ResourceGroupDto(d);
				})
			);
	}

	create(d: ResourceGroupDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATE',
				{
					collection: 'resource-group',
					document: d
				}
			);
	}

	update(id: string, d: ResourceGroupDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATE',
				{
					collection: 'resource-group',
					id: id,
					document: d
				}
			);
	}

	remove(id: string) {
		return this.restService
			.runSchemeOptions<number, any>(
				'REMOVE',
				{
					collection: 'resource-group',
					id: id
				}
			);
	}
}
