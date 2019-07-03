import { DBDataTransform } from '../db-data-transform';

export class DBMongoDataTransform extends DBDataTransform {
	fromDb(d: any) {
		return d;
	}

	toDb(d: any) {
		return d;
	}
}