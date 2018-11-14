import { MongoDb } from './../shared/db';

import { map } from 'rxjs/operators';
import { GrabberSettingsDto } from '@magz/common';

export class GrabberSettingsService {
	private collection = 'grabber-settings';

	list() {
		return new MongoDb(this.collection).find({})
			.pipe(
				map(list => {
					return list.map(i => new GrabberSettingsDto(i));
				})
			);
	}
}