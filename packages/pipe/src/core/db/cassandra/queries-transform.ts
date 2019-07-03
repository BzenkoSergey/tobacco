import { DBQueriesTransform } from '../db-queries-transform';
import { DBQueries } from '../db-queries.type';

export class DBCassandraQueriesTransform extends DBQueriesTransform {
	constructor(private table: string) {
		super();
	}

	get(queries: DBQueries) {
		const where = [];
		const whereValues = [];
		Object.keys(queries.query).forEach(prop => {
			where.push('"' + prop + '" = ?');
			const value = queries.query[prop];
			whereValues.push(value === null ? '' : value);
		})
		const cql = 'SELECT * FROM ' + this.table + ' WHERE ' + where.join(' AND ');
		return [
			cql,
			whereValues
		] as [string, any];
	}
}