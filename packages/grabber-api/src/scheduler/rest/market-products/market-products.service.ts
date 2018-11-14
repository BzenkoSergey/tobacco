import { MongoDb } from '../shared/db';

import { map } from 'rxjs/operators';

import { MarketProductDto } from '@magz/common';

export class MarketProductsService {
	private collection = 'market-products';

	list() {
		return new MongoDb(this.collection).find({})
			.pipe(
				map(list => {
					return list.map(i => new MarketProductDto(i));
				})
			);
	}
}