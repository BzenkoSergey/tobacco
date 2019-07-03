import { DBQueriesTransform } from '../db-queries-transform';
import { DBQueries } from '../db-queries.type';

export class DBMongoQueriesTransform extends DBQueriesTransform {
	get(queries: DBQueries) {
		return queries;
	}
}