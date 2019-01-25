import { Subject } from 'rxjs';
import { 
	ReplaceOneOptions, 
	WriteOpResult,
	InsertOneWriteOpResult,
	InsertWriteOpResult,
	UpdateWriteOpResult
} from 'mongodb';

import { DbManager } from './db-manager';
const bbManager = new DbManager();

export class MongoDb {
	private url = 'mongodb://127.0.0.1:27017';
	private queryReTryDelay = 100;
	private manager = bbManager;
	private isolated = false;

	constructor(
		private collection: string,
		isolated = false,
		url?: string,
		dbName?: string
	) {
		if (url) {
			this.url = url;
		}
		if (isolated) {
			this.manager = new DbManager(this.url, dbName);
		}
	}

	update(filter: Object, update: Object, options: ReplaceOneOptions & { multi?: boolean }, subj?: Subject<WriteOpResult>): Subject<WriteOpResult> {
		subj = subj || new Subject<WriteOpResult>();
		this.getDb('update', filter).subscribe(db => {
			db[0].collection(this.collection).update(
				filter,
				update,
				options,
				(err, result) => {
					if (err) {
						db[1]();
						if (this.needRetry(err)) {
							this.update(filter, update, options, subj)
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

	updateOne(filter: Object, update: Object, subj?: Subject<UpdateWriteOpResult>): Subject<UpdateWriteOpResult> {
		subj = subj || new Subject<UpdateWriteOpResult>();
		this.getDb('updateOne', filter).subscribe(db => {
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

						db[1]();
						if (this.needRetry(err)) {
							this.updateOne(filter, update, subj)
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
		err => {
			debugger;
		},
		() => {
	
		});
		return subj;
	}

	remove(selector: Object, subj?: Subject<WriteOpResult>): Subject<WriteOpResult> {
		subj = subj || new Subject<WriteOpResult>();
		this.getDb('remove').subscribe(db => {
			db[0].collection(this.collection).deleteMany(
				selector,
				(err, result) => {
					if (err) {
						db[1]();
						if (this.needRetry(err)) {
							this.remove(selector, subj)
							return;
						}
						subj.error(err);
						// setTimeout(() => {
						// 	this.remove(selector, subj);
						// }, this.queryReTryDelay);
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
		this.getDb('count').subscribe(db => {
			db[0].collection(this.collection).count(
				query,
				(err, result) => {
					if (err) {
						db[1]();
						if (this.needRetry(err)) {
							this.count(query, subj)
							return;
						}
						subj.error(err);
						// setTimeout(() => {
						// 	this.count(query, subj);
						// }, this.queryReTryDelay);
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
		this.getDb('findOne', query).subscribe(db => {
			let find = db[0].collection(this.collection)
				.findOne(
					query,
					(err, result) => {
						if (err) {
							db[1]();
							if (this.needRetry(err)) {
								this.findOne(query, subj)
								return;
							}
							subj.error(err);
							// setTimeout(() => {
							// 	this.find(query, subj);
							// }, this.queryReTryDelay);
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
		this.getDb('find', query).subscribe(db => {
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
						this.find(query, subj, limit, skip, sort)
						return;
					}
					subj.error(err);
					// setTimeout(() => {
					// 	this.find(query, subj, limit, skip);
					// }, this.queryReTryDelay);
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
		this.getDb('findSort').subscribe(db => {
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
					// setTimeout(() => {
					// 	this.find(query, subj, limit, skip);
					// }, this.queryReTryDelay);
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
		this.getDb('aggregate').subscribe(db => {
			db[0].collection(this.collection)
				.aggregate(query, { allowDiskUse: true })
				.toArray((err, result) => {
					if (err) {
						db[1]();
						if (this.needRetry(err)) {
							this.aggregate(query, subj);
							return;
						}
						subj.error(err);
						return;

						// setTimeout(() => {
						// 	this.aggregate(query, subj);
						// }, this.queryReTryDelay);
						// return;
					}
					db[1]();
					subj.next(result);
					subj.complete();
				});
		});
		return subj;
	}

	bulkWrite(list: Object[], subj?: Subject<any>): Subject<any> {
		subj = subj || new Subject<any>();
		this.getDb('bulkWrite').subscribe(db => {
			db[0].collection(this.collection)
				.bulkWrite(list, {}, (err, result) => {
					if (err) {
						db[1]();
						if (this.needRetry(err)) {
							this.bulkWrite(list, subj);
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
		try {
			this.getDb('insertOne', docs).subscribe(db => {
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
							db[1]();
							if (this.needRetry(err)) {
								this.insertOne(docs, subj);
								return;
							}
							subj.error(err);
							// setTimeout(() => {
							// 	this.insertOne(docs, subj);
							// }, this.queryReTryDelay);
							return;
						}
						db[1]();
						subj.next(result);
						subj.complete();
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
		this.getDb('insertMany').subscribe(db => {
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
						// setTimeout(() => {
						// 	this.insertMany(docs, subj);
						// }, this.queryReTryDelay);
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
		this.getDb('replaceOne').subscribe(db => {
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

						// setTimeout(() => {
						// 	this.replaceOne(filter, doc, options, subj);
						// }, this.queryReTryDelay);
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

	private needRetry(err: any) {
		console.warn(err);
		return !!~err.message.indexOf('failed to connect to server ');
	}

	private getDb(code?: string, args?: any) {
		return this.manager.get(code, args);
	}
}