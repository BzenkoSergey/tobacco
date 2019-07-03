import { DBQueries } from './db-queries.type';

export abstract class DBQueriesTransform {
	abstract get(queries: DBQueries): any;
}