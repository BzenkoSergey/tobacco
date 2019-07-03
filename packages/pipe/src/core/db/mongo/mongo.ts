import { Subject } from 'rxjs';
import { ObjectID } from 'mongodb';

import { DbManager } from './db-manager';
const bbManager = new DbManager();

import { DBBase } from '../db-base.abstract';
import { DBQueries } from './../db-queries.type';
import { DBUpdate } from './../db-update.type';
import { DBMongoQueriesTransform } from './queries-transform';
import { DBMongoDataTransform } from './data-transform';

export class DBMongo extends DBBase {
	private manager = bbManager;

	protected queriesTransform: DBMongoQueriesTransform;
	protected dataTransform: DBMongoDataTransform;

	constructor(
		protected table = '',
		url = 'mongodb://192.168.0.181:27017',
		isolated = false,
		dbName?: string
	) {
		super(table);

		this.queriesTransform = new DBMongoQueriesTransform();
		this.dataTransform = new DBMongoDataTransform();

		if (isolated) {
			this.manager = new DbManager(url, dbName);
		}
	}

	createId(id?: string) {
		if (id) {
			return new ObjectID(id);
		}
		return new ObjectID();
	}

	updateOne<T>(queries: DBQueries, update: DBUpdate<T>, subj?: Subject<never>) {
		subj = subj || new Subject<never>();
		
		this.getDb('updateOne', queries)
			.subscribe(
				db => {
					db[0].collection(this.table).updateOne(
						queries,
						update,
						err => {
							if (err) {
								db[1]();
								if (this.needRetry(err)) {
									this.updateOne(queries, update, subj)
									return;
								}
								subj.error(err);
								return;
							}
							db[1]();
							subj.next();
							subj.complete();
						}
					);
				},
				err => subj.error(err),
			);
		return subj.asObservable();
	}

	findOne<T>(queries: DBQueries, subj?: Subject<T>) {
		// console.log('CassandraDb->findOne');
		subj = subj || new Subject<any>();

		const q = this.queriesTransform.get(queries);
		this.getDb('findOne', q)
			.subscribe(
				db => {
					db[0]
						.collection(this.table)
						.findOne(
							q,
							(err, result) => {
								if (err) {
									db[1]();
									if (this.needRetry(err)) {
										this.findOne(queries, subj)
										return;
									}
									subj.error(err);
									return;
								}
								db[1]();
								
								// @ts-ignore
								const item = result as T;
								const response = this.dataTransform.fromDb(item);

								subj.next(response);
								subj.complete();
							}
						);
				},
				e => subj.error(e)
			);
		return subj.asObservable();
	}

	find<T>(queries: DBQueries, subj?: Subject<T[]>) {
		// console.log('CassandraDb->find');
		subj = subj || new Subject<T[]>();

		const q = this.queriesTransform.get(queries);
		this.getDb('find', q)
			.subscribe(
				db => {
					let find = db[0].collection(this.table).find(q);

					if (queries.modifiers.sort) {
						find = find.sort(queries.modifiers.sort);
					}
					if (queries.modifiers.limit) {
						find = find.limit(queries.modifiers.limit);
					}
					if (queries.modifiers.skip) {
						find = find.skip(queries.modifiers.skip);
					}

					find.toArray((err, result) => {
						if (err) {
							db[1]();
							if (this.needRetry(err)) {
								this.find(queries, subj);
								return;
							}
							subj.error(err);
							return;
						}
						db[1]();

						// @ts-ignore
						const items = result as T[];
						const response = items.map(i => {
							return this.dataTransform.fromDb(i);
						})

						subj.next(response);
						subj.complete();
					});
				},
				e => subj.error(e)
			);

		return subj.asObservable();
	}

	insertOne<T>(doc: T, subj?: Subject<{insertedId: string}>) {
		// console.log('CassandraDb->insertOne');
		const docToSave = this.dataTransform.toDb(doc);
		subj = subj || new Subject<{insertedId: string}>();

		this.getDb('insertOne', docToSave)
			.subscribe(
				db => {
					db[0].collection(this.table)
						.insertOne(
							docToSave,
							{
								checkKeys: false
							},
							(err, result) => {
								if (err) {
									db[1]();
									if (this.needRetry(err)) {
										this.insertOne(doc, subj);
										return;
									}
									subj.error(err);
									return;
								}
								db[1]();
								subj.next(result);
								subj.complete();
							}
						);
					},
				e => subj.error(e)
			);
		return subj.asObservable();
	}

	private needRetry(err: any) {
		console.warn(err);
		return !!~err.message.indexOf('failed to connect to server ');
	}

	private getDb(code?: string, args?: any) {
		return this.manager.get(code, args);
	}
}