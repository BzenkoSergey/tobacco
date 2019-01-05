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

import { DbManager } from './db-manager';
const bbManager = new DbManager();

export class MongoDb {
	private url = 'mongodb://localhost:27017';
	private queryReTryDelay = 100;
	private manager = bbManager;
	private isolated = false;

	constructor(
		private collection: string,
		isolated = false,
		url?: string,
		dbName?: string
	) {
		this.isolated = isolated;
		if (url) {
			this.url = url;
		}
		if (isolated) {
			this.manager = new DbManager(this.url, dbName);
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
						debugger;
						subj.error(err);
						return;
					}
					subj.next(result);
					subj.complete();
					db[1]();
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
						// setTimeout(() => {
						// 	this.updateOne(filter, update, subj);
						// }, this.queryReTryDelay);

						subj.error(err);
						db[1]();
						return;
					}
					subj.next(result);
					subj.complete();
					db[1]();
				}
			);
		},
		err => {
			debugger;
		},
		() => {
	
		});
		return subj;
	}

	remove(selector: Object, subj?: Subject<WriteOpResult>): Subject<WriteOpResult> {
		subj = subj || new Subject<WriteOpResult>();
		this.getDb().subscribe(db => {
			db[0].collection(this.collection).deleteMany(
				selector,
				(err, result) => {
					if (err) {
						db[1]();
						debugger;
						subj.error(err);
						// setTimeout(() => {
						// 	this.remove(selector, subj);
						// }, this.queryReTryDelay);
						return;
					}
					subj.next(result);
					subj.complete();
					db[1]();
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
						debugger;
						subj.error(err);
						// setTimeout(() => {
						// 	this.count(query, subj);
						// }, this.queryReTryDelay);
						return;
					}
					subj.next(result);
					subj.complete();
					db[1]();
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
							debugger;
							subj.error(err);
							// setTimeout(() => {
							// 	this.find(query, subj);
							// }, this.queryReTryDelay);
							return;
						}
						subj.next(result);
						subj.complete();
						db[1]();
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
					subj.error(err);
					db[1]();
					// setTimeout(() => {
					// 	this.find(query, subj, limit, skip);
					// }, this.queryReTryDelay);
					return;
				}
				subj.next(result);
				subj.complete();
				db[1]();
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
					debugger;
					subj.error(err);
					// setTimeout(() => {
					// 	this.find(query, subj, limit, skip);
					// }, this.queryReTryDelay);
					return;
				}
				subj.next(result);
				subj.complete();
				db[1]();
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
						subj.error(err);
						db[1]();
						return;

						// setTimeout(() => {
						// 	this.aggregate(query, subj);
						// }, this.queryReTryDelay);
						// return;
					}
					subj.next(result);
					subj.complete();
					db[1]();
				});
		});
		return subj;
	}

	insertOne(docs: Object, subj?: Subject<InsertOneWriteOpResult>): Subject<InsertOneWriteOpResult> {
		subj = subj || new Subject<InsertOneWriteOpResult>();
		try {
			this.getDb().subscribe(db => {
				db[0].collection(this.collection).insertOne(
					docs,
					{
						checkKeys: false
					},
					(err, result) => {
						// debugger;
						// debugger;
						// console.log(err);
						// console.log('======');
						// console.log(result);
						if (err) {
							subj.error(err);
							// setTimeout(() => {
							// 	this.insertOne(docs, subj);
							// }, this.queryReTryDelay);
							return;
						}
						subj.next(result);
						subj.complete();
						db[1]();
					}
				);
			});
		} catch(e) {
			subj.error(e);
		}
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
						debugger;
						subj.error(err);
						// setTimeout(() => {
						// 	this.insertMany(docs, subj);
						// }, this.queryReTryDelay);
						return;
					}
					subj.next(result);
					subj.complete();
					db[1]();
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
						subj.error(err);

						// setTimeout(() => {
						// 	this.replaceOne(filter, doc, options, subj);
						// }, this.queryReTryDelay);
						return;
					}
					subj.next(result);
					subj.complete();
					db[1]();
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

	private getDb(subj? :Subject<[Db, () => void]>) {
		return this.manager.get();
		subj = subj || new Subject<[Db, () => void]>();

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
					if (err.errorLabels && err.errorLabels.indexOf('TransientTransactionError') >= 0) {
						console.log('TransientTransactionError, retrying transaction ...');
						setTimeout(() => {
							this.getDb(subj);
						}, Math.random() * 1000);
						return;
					}
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