import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from './../pipes/pipes.service';
import { NotificationDto } from './notification.dto';

@Injectable()
export class NotificationRestService {
	constructor(private restService: PipeRestService) {}

	list(query?: any) {
		return this.restService
			.runSchemeOptions<NotificationDto[], any>(
				'GET_LIST',
				{
					collection: 'notification',
					query: query || {}
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new NotificationDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<NotificationDto, any>(
				'GET',
				{
					collection: 'notification',
					id: id
				}
			)
			.pipe(
				map(d => {
					return new NotificationDto(d);
				})
			);
	}

	create(d: NotificationDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATE',
				{
					collection: 'notification',
					document: d
				}
			);
	}

	update(id: string, d: NotificationDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATE',
				{
					collection: 'notification',
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
					collection: 'notification',
					id: id
				}
			);
	}
}
