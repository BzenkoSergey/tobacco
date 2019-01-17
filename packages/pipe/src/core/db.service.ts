import { MongoDb } from './db';

export class DbService {
	private map = new Map<string, MongoDb>();

	get(collection: string) {
		if (this.map.has(collection)) {
			return this.map.get(collection);
		}
		const db = new MongoDb(collection, false);
		this.map.set(collection, db);
		return db;
	}
}