import { MongoDb } from '../shared/db';

import { map } from 'rxjs/operators';

import { MarketDto } from '@magz/common';

export class MarketsService {
	private collection = 'markets';

	list() {
		return new MongoDb(this.collection).find({})
			.pipe(
				map(list => {
					return list.map(i => new MarketDto(i));
				})
			);
	}
}