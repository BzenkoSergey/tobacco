import { Observable, Subject } from 'rxjs';

import { DBQueries } from './db-queries.type';
import { DBUpdate } from './db-update.type';
import { DBQueriesTransform } from './db-queries-transform';
import { DBDataTransform } from './db-data-transform';

export abstract class DBBase {
	protected abstract queriesTransform: DBQueriesTransform;
	protected abstract dataTransform: DBDataTransform;

	abstract updateOne<T>(filter: Object, update: DBUpdate<T>, subj?: Subject<never>): Observable<never>;
	abstract findOne<T>(query: DBQueries, subj?: Subject<T>): Observable<T>;
	abstract find<T>(query: DBQueries, subj?: Subject<T[]>): Observable<T[]>;
	abstract insertOne<T>(doc: T, subj?: Subject<{insertedId: string}>): Observable<{insertedId: string}>;
	abstract createId(id?: string): any;

	constructor(protected table: string) {}
}