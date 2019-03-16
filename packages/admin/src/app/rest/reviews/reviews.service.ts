import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PipeRestService } from '../pipes/pipes.service';
import { ReviewDto } from './review.dto';

@Injectable()
export class ReviewsRestService {
	constructor(private restService: PipeRestService) {}

	list(query?: any, limit?: number, skip?: number, sort?: any) {
		return this.restService
			.runSchemeOptions<ReviewDto[], any>(
				'GETEXT_LIST',
				{
					collection: 'reviews',
					query: query || {},
					limit: limit,
					skip: skip,
					sort: sort,
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(list => {
					return list.map(d => new ReviewDto(d));
				})
			);
	}

	get(id: string) {
		return this.restService
			.runSchemeOptions<ReviewDto, any>(
				'GETEXT',
				{
					collection: 'reviews',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			)
			.pipe(
				map(d => {
					return new ReviewDto(d);
				})
			);
	}

	create(d: ReviewDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'CREATEEXT',
				{
					collection: 'reviews',
					document: d,
					modes: ['DB_NO_SYNC']
				}
			);
	}

	update(id: string, d: ReviewDto) {
		return this.restService
			.runSchemeOptions<number, any>(
				'UPDATEEXT',
				{
					collection: 'reviews',
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
					collection: 'reviews',
					id: id,
					modes: ['DB_NO_SYNC']
				}
			);
	}
}
