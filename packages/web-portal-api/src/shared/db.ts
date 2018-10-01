import { Observable, Subject } from 'rxjs';
import { 
	MongoClient, 
	Db, 
	Collection, 
	ReplaceOneOptions, 
	MongoCallback, 
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

export class MongoDb {
	private url = 'mongodb://magz_bzenko:spd061090@ds159812.mlab.com:59812/?authMechanism=SCRAM-SHA-1&authSource=tobacco';
	private dbs: Db;
	private client = new MongoClient();

	private connections: ConnectionInfo[] = [];
	private queries: QueryInfo[] = [];
	private queryReTryDelay = 100;
	private connectionReTryDelay = 100;

	constructor(private collection: string) {}

	update(filter: Object, update: Object, options: ReplaceOneOptions & { multi?: boolean }, subj?: Subject<WriteOpResult>): Subject<WriteOpResult> {
		const queryInfo = new QueryInfo();
		queryInfo.data = [filter, update, options];
		queryInfo.req = 'update';
		this.queries.push(queryInfo);

		subj = subj || new Subject<WriteOpResult>();
		this.getDb().subscribe(db => {
			db.collection(this.collection).update(
				filter,
				update,
				options,
				(err, result) => {
					queryInfo.result = result;
					if (err) {
						queryInfo.error = err;
						this.error(queryInfo);
						setTimeout(() => {
							this.update(filter, update, options, subj);
						}, this.queryReTryDelay);
						return;
					}
					subj.next(result);
					subj.complete();
				}
			);
		});
		return subj;
	}

	updateOne(filter: Object, update: Object, subj?: Subject<UpdateWriteOpResult>): Subject<UpdateWriteOpResult> {
		const queryInfo = new QueryInfo();
		queryInfo.data = [filter, update];
		queryInfo.req = 'updateOne';
		this.queries.push(queryInfo);

		subj = subj || new Subject<UpdateWriteOpResult>();
		this.getDb().subscribe(db => {
			db.collection(this.collection).updateOne(
				filter,
				update,
				(err, result) => {
					queryInfo.result = result;
					if (err) {
						queryInfo.error = err;
						this.error(queryInfo);
						setTimeout(() => {
							this.updateOne(filter, update, subj);
						}, this.queryReTryDelay);
						return;
					}
					subj.next(result);
					subj.complete();
				}
			);
		});
		return subj;
	}

	remove(selector: Object, subj?: Subject<WriteOpResult>): Subject<WriteOpResult> {
		const queryInfo = new QueryInfo();
		queryInfo.data = [selector];
		queryInfo.req = 'remove';
		this.queries.push(queryInfo);

		subj = subj || new Subject<WriteOpResult>();
		this.getDb().subscribe(db => {
			db.collection(this.collection).remove(
				selector,
				(err, result) => {
					queryInfo.result = result;
					if (err) {
						queryInfo.error = err;
						this.error(queryInfo);
						setTimeout(() => {
							this.remove(selector, subj);
						}, this.queryReTryDelay);
						return;
					}
					subj.next(result);
					subj.complete();
				}
			);
		});
		return subj;
	}

	count(query: Object, subj?: Subject<number>): Subject<number> {
		const queryInfo = new QueryInfo();
		queryInfo.data = [query];
		queryInfo.req = 'count';
		this.queries.push(queryInfo);

		subj = subj || new Subject<number>();
		this.getDb().subscribe(db => {
			db.collection(this.collection).count(
				query,
				(err, result) => {
					queryInfo.result = result;
					if (err) {
						queryInfo.error = err;
						this.error(queryInfo);
						setTimeout(() => {
							this.count(query, subj);
						}, this.queryReTryDelay);
						return;
					}
					subj.next(result);
					subj.complete();
				}
			);
		});
		return subj;
	}

	find(query: Object, subj?: Subject<any>, limit?: number, skip?: number): Subject<any> {
		const queryInfo = new QueryInfo();
		queryInfo.data = [query];
		queryInfo.req = 'find';
		this.queries.push(queryInfo);

		subj = subj || new Subject<any>();
		this.getDb().subscribe(db => {
			let find = db.collection(this.collection).find(query);
			if (limit) {
				find = find.limit(limit);
			}
			if (skip) {
				find = find.skip(skip);
			}
			
			find.toArray((err, result) => {
				queryInfo.result = result;
				if (err) {
					queryInfo.error = err;
					this.error(queryInfo);
					setTimeout(() => {
						this.find(query, subj, limit, skip);
					}, this.queryReTryDelay);
					return;
				}
				subj.next(result);
				subj.complete();
			});
		});
		return subj;
	}

	aggregate(query: Object[], subj?: Subject<any>): Subject<any> {
		const queryInfo = new QueryInfo();
		queryInfo.data = [query];
		queryInfo.req = 'aggregate';
		this.queries.push(queryInfo);

		subj = subj || new Subject<any>();
		this.getDb().subscribe(db => {
			db.collection(this.collection)
				.aggregate(query)
				.toArray((err, result) => {
					queryInfo.result = result;
					if (err) {
						queryInfo.error = err;
						this.error(queryInfo);
						setTimeout(() => {
							this.aggregate(query, subj);
						}, this.queryReTryDelay);
						return;
					}
					subj.next(result);
					subj.complete();
				});
		});
		return subj;
	}

	insertOne(docs: Object, subj?: Subject<InsertOneWriteOpResult>): Subject<InsertOneWriteOpResult> {
		const queryInfo = new QueryInfo();
		queryInfo.data = [docs];
		queryInfo.req = 'insertOne';
		this.queries.push(queryInfo);

		subj = subj || new Subject<InsertOneWriteOpResult>();
		this.getDb().subscribe(db => {
			db.collection(this.collection).insertOne(
				docs,
				(err, result) => {
					queryInfo.result = result;
					if (err) {
						queryInfo.error = err;
						this.error(queryInfo);
						setTimeout(() => {
							this.insertOne(docs, subj);
						}, this.queryReTryDelay);
						return;
					}
					subj.next(result);
					subj.complete();
				}
			);
		});
		return subj;
	}

	insertMany(docs: Object[], subj?: Subject<InsertWriteOpResult>): Subject<InsertWriteOpResult> {
		const queryInfo = new QueryInfo();
		queryInfo.data = [docs];
		queryInfo.req = 'insertMany';
		this.queries.push(queryInfo);

		subj = subj || new Subject<InsertWriteOpResult>();
		this.getDb().subscribe(db => {
			db.collection(this.collection).insertMany(
				docs,
				(err, result) => {
					queryInfo.result = result;
					if (err) {
						queryInfo.error = err;
						this.error(queryInfo);
						setTimeout(() => {
							this.insertMany(docs, subj);
						}, this.queryReTryDelay);
						return;
					}
					subj.next(result);
					subj.complete();
				}
			);
		});
		return subj;
	}
	
	replaceOne(filter: Object, doc: Object, options: ReplaceOneOptions, subj?: Subject<UpdateWriteOpResult>): Subject<UpdateWriteOpResult> {
		const queryInfo = new QueryInfo();
		queryInfo.data = [filter, doc, options];
		queryInfo.req = 'replaceOne';
		this.queries.push(queryInfo);

		subj = subj || new Subject<UpdateWriteOpResult>();
		this.getDb().subscribe(db => {
			db.collection(this.collection).replaceOne(
				filter,
				doc,
				options,
				(err, result) => {
					queryInfo.result = result;
					if (err) {
						queryInfo.error = err;
						this.error(queryInfo);
						setTimeout(() => {
							this.replaceOne(filter, doc, options, subj);
						}, this.queryReTryDelay);
						return;
					}
					subj.next(result);
					subj.complete();
				}
			);
		});
		return subj;
	}

	perform<T>(cb: (db: Db, error: any) => void): Subject<T> {
		const subj = new Subject<T>();
		let d0 = Date.now();
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

	private error(info: QueryInfo|ConnectionInfo) {
		console.error(info);
	}

	private getDb(subj? :Subject<Db>) {
		subj = subj || new Subject<Db>();
		if (this.dbs) {
			setTimeout(() => {
				subj.next(this.dbs);
				subj.complete();
			});
			return subj;
		}

		const connectionInfo = new ConnectionInfo();
		this.connections.push(connectionInfo);
		MongoClient.connect(
			this.url, 
			{
				poolSize: 20000,
				useNewUrlParser: true
			}, 
			(err, client) => {
				if (err) {
					connectionInfo.error = err;
					this.error(connectionInfo);
					subj.error(err);
					return;
				}
				// const db = db.db(this.collection);
				this.dbs = client.db('tobacco');
				subj.next(this.dbs);
				subj.complete();
			}
		);
		return subj;
	}
}