import { Subject } from 'rxjs';
import { 
	MongoClient, 
	Db,
	ReplaceOneOptions, 
	WriteOpResult,
	InsertOneWriteOpResult,
	InsertWriteOpResult,
	UpdateWriteOpResult
} from 'mongodb';

class ConnectionInfo {
	error: any;
}

class QueryInfo {
	req: string;
	data: any;
	result: any;
	error: any;
}

import { DbManager } from '../db/mongo/db-manager';
// const bbManager = new DbManager('mongodb://192.168.0.175:27017');
const bbManager = new DbManager('mongodb://192.168.0.181:27017');

export class MongoExtDb {
	private url = 'mongodb://192.168.0.181:27017';
	// private url = 'mongodb://192.168.0.175:27017';
	private connections: ConnectionInfo[] = [];
	private queries: QueryInfo[] = [];
	private queryReTryDelay = 100;
	private manager = bbManager;
	private isolated = false;

	constructor(
		private collection: string,
		isolated = false
	) {
		this.isolated = isolated;
		if (isolated) {
			this.manager = new DbManager('mongodb://192.168.0.181:27017');
			// this.manager = new DbManager('mongodb://127.0.0.1:27017');
		}
	}

	update(filter: Object, update: Object, options: ReplaceOneOptions & { multi?: boolean }, subj?: Subject<WriteOpResult>): Subject<WriteOpResult> {

		subj = subj || new Subject<WriteOpResult>();
		this.getDb().subscribe(db => {
			db[0].collection(this.collection).update(
				filter,
				update,
				options,
				(err, result) => {
					if (err) {
			
						db[1]();
						if (this.needRetry(err)) {
							this.update(filter, update, options, subj);
							return;
						}
						subj.error(err);
						//queryInfo.error = err;
						//this.error(queryInfo);
						//setTimeout(() => {
						//	this.update(filter, update, options, subj);
						//}, this.queryReTryDelay);
						return;
					}
					db[1]();
					subj.next(result);
					subj.complete();
				}
			);
		});
		return subj;
	}

	updateOne(filter: Object, update: Object, subj?: Subject<UpdateWriteOpResult>): Subject<UpdateWriteOpResult> {


		subj = subj || new Subject<UpdateWriteOpResult>();
		this.getDb().subscribe(db => {
			db[0].collection(this.collection).updateOne(
				filter,
				update,
				// {
				// 	readConcern: { w: "snapshot", wtimeout: 5000 },
				// 	writeConcern: { w: "majority", wtimeout: 5000 }
				// },
				(err, result) => {
					if (err) {
						db[1]();
						if (this.needRetry(err)) {
							this.updateOne(filter, update, subj);
							return;
						}
						// setTimeout(() => {
						// 	this.updateOne(filter, update, subj);
						// }, this.queryReTryDelay);
						subj.error(err);
						return;
					}
					db[1]();
					subj.next(result);
					subj.complete();
				}
			);
		});
		return subj;
	}

	remove(selector: Object, subj?: Subject<WriteOpResult>): Subject<WriteOpResult> {
		subj = subj || new Subject<WriteOpResult>();
		this.getDb().subscribe(db => {
			db[0].collection(this.collection).remove(
				selector,
				(err, result) => {
					if (err) {
						db[1]();
						if (this.needRetry(err)) {
							this.remove(selector, subj);
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
		});
		return subj;
	}

	count(query: Object, subj?: Subject<number>): Subject<number> {
		subj = subj || new Subject<number>();
		this.getDb().subscribe(db => {
			db[0].collection(this.collection).count(
				query,
				(err, result) => {
					if (err) {
						db[1]();
						if (this.needRetry(err)) {
							this.count(query, subj);
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
		});
		return subj;
	}

	findOne(query: any, subj?: Subject<any>): Subject<any> {
		subj = subj || new Subject<any>();
		this.getDb().subscribe(db => {
			let find = db[0].collection(this.collection)
				.findOne(
					query,
					(err, result) => {
						if (err) {
							db[1]();
							if (this.needRetry(err)) {
								this.findOne(query, subj);
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
		});
		return subj;
	}

	find(query: Object, subj?: Subject<any>, limit?: number, skip?: number, sort?: any): Subject<any> {
		subj = subj || new Subject<any>();
		this.getDb().subscribe(db => {
			let find = db[0].collection(this.collection).find(query);
			if (sort) {
				find = find.sort(sort);
			}
			if (limit) {
				find = find.limit(limit);
			}
			if (skip) {
				find = find.skip(skip);
			}
			
			find.toArray((err, result) => {
				if (err) {
					db[1]();
					if (this.needRetry(err)) {
						this.find(query, subj, limit, skip, sort);
						return;
					}
					subj.error(err);
					return;
				}
				db[1]();
				subj.next(result);
				subj.complete();
			});
		});
		return subj;
	}

	findSort(query: Object, subj?: Subject<any>, limit?: number, skip?: number): Subject<any> {
		subj = subj || new Subject<any>();
		this.getDb().subscribe(db => {
			let find = db[0].collection(this.collection)
				.find(query)
				.project({ score: { $meta: "textScore" } })
				.sort({score:{$meta:"textScore"}});
			if (limit) {
				find = find.limit(limit);
			}
			if (skip) {
				find = find.skip(skip);
			}
			
			find.toArray((err, result) => {
				if (err) {
					db[1]();
					if (this.needRetry(err)) {
						this.findSort(query, subj, limit, skip);
						return;
					}
					subj.error(err);
					return;
				}
				db[1]();
				subj.next(result);
				subj.complete();
			});
		});
		return subj;
	}

	aggregate(query: Object[], subj?: Subject<any>): Subject<any> {
		subj = subj || new Subject<any>();
		this.getDb().subscribe(db => {
			db[0].collection(this.collection)
				.aggregate(query)
				.toArray((err, result) => {
					if (err) {
						db[1]();
						if (this.needRetry(err)) {
							this.aggregate(query, subj);
							return;
						}
						subj.error(err);
						return;
					}
					db[1]();
					subj.next(result);
					subj.complete();
				});
		});
		return subj;
	}

	insertOne(docs: Object, subj?: Subject<InsertOneWriteOpResult>): Subject<InsertOneWriteOpResult> {
		subj = subj || new Subject<InsertOneWriteOpResult>();
		this.getDb().subscribe(db => {
			db[0].collection(this.collection).insertOne(
				docs,
				(err, result) => {
					// console.log(err);
					// console.log('======');
					// console.log(result);
					if (err) {
						db[1]();
						if (this.needRetry(err)) {
							this.insertOne(docs, subj);
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
		});
		return subj;
	}

	insertMany(docs: Object[], subj?: Subject<InsertWriteOpResult>): Subject<InsertWriteOpResult> {
		subj = subj || new Subject<InsertWriteOpResult>();
		this.getDb().subscribe(db => {
			db[0].collection(this.collection).insertMany(
				docs,
				(err, result) => {
					if (err) {
						db[1]();
						if (this.needRetry(err)) {
							this.insertMany(docs, subj);
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
		});
		return subj;
	}
	
	replaceOne(filter: Object, doc: Object, options: ReplaceOneOptions, subj?: Subject<UpdateWriteOpResult>): Subject<UpdateWriteOpResult> {
		subj = subj || new Subject<UpdateWriteOpResult>();
		this.getDb().subscribe(db => {
			db[0].collection(this.collection).replaceOne(
				filter,
				doc,
				options,
				(err, result) => {
					if (err) {
						db[1]();
						if (this.needRetry(err)) {
							this.replaceOne(filter, doc, options, subj);
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
		});
		return subj;
	}

	perform<T>(cb: (db: Db, error: any) => void): Subject<T> {
		const subj = new Subject<T>();
		this.getDb().subscribe(db => {
			let d1 = Date.now();

			cb(db, (d: T, error?: any) => {
				if(error) {
					subj.error(error);
					return;
				}
				subj.next(d);
				subj.complete();
			});
		});
		return subj;
	}

	private needRetry(err: any) {
		console.warn(err);
		return !!~err.message.indexOf('failed to connect to server ');
	}

	private error(info: QueryInfo|ConnectionInfo) {
		// console.error(info);
	}

	private getDb(subj? :Subject<[Db, () => void]>) {
		return this.manager.get();
		subj = subj || new Subject<[Db, () => void]>();

		const connectionInfo = new ConnectionInfo();
		this.connections.push(connectionInfo);
		MongoClient.connect(
			this.url, 
			{

				// connectTimeoutMS: 5000,
				// socketTimeoutMS: 30000,
				// poolSize: 20000,
				useNewUrlParser: true
				// ,
				// autoReconnect: true,
				// reconnectTries: Number.MAX_VALUE
			}, 
			(err, client) => {
				if (err) {
					connectionInfo.error = err;
					if (err.errorLabels && err.errorLabels.indexOf('TransientTransactionError') >= 0) {
						console.log('TransientTransactionError, retrying transaction ...');
						setTimeout(() => {
							this.getDb(subj);
						}, Math.random() * 1000);
						return;
					}
					this.error(connectionInfo);
					subj.error(err);
					return;
				}
				console.log('Success MOngod Db Connection');
				// const db = db.db(this.collection);
				const dbs = client.db('tobacco');
				subj.next([dbs, () => {
					client.close();
				}]);
				subj.complete();
			}
		);
		return subj;
	}
}