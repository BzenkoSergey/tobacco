import { ObjectID } from 'mongodb';

import { MongoExtDb } from '../trash/db-ext';

export class ResourceSettingsService {
	private db = new MongoExtDb('resource');

	get(id: string) {
		return this.db.findOne({
			_id: new ObjectID(id)
		})
	}
}