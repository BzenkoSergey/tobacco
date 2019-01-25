import { Subject } from 'rxjs';
import { MongoClient, Db } from 'mongodb';

import { Queue } from './queue';

export class DbManager {
	private l = 1;
	private queue: Queue;

	// queue: any[] = [];

	constructor(
		private url = 'mongodb://127.0.0.1:27017',
		private dbName = 'tobacco',
		limit = 10
	) {
		this.queue = new Queue(limit);
	}

	get(code?: string, args?: any) {
		const fn = () => {
			return this.getDb(null, code, args);
		};
		return this.queue.run(fn);
	}

	private getDb(subj?: Subject<[Db, () => void]>, code?: string, args?: any) {
		subj = subj || new Subject<[Db, () => void]>();
		const a = setInterval(() => {
			console.log('WAIT CONNECTION');
		}, 5000);
		MongoClient.connect(
			this.url, 
			{
				//connectTimeoutMS: 50000,
				// socketTimeoutMS: 30000,
				// poolSize: 20000,
				useNewUrlParser: true
				// ,
				// autoReconnect: true,
				// reconnectTries: Number.MAX_VALUE
			}, 
			(err, client) => {
				clearInterval(a);
				if (err) {
					setTimeout(() => {
						this.getDb(subj, code, args);
						console.error('SOME MONGO ERROR', err);
					}, (Math.random() * 700) + 3000);
					return;
					if (err.errorLabels && err.errorLabels.indexOf('TransientTransactionError') >= 0) {
						console.error('TransientTransactionError, retrying transaction ...');
						setTimeout(() => {
							this.getDb(subj);
						}, Math.random() * 1000);
						return;
					}
					subj.error(err);
					return;
				}
				const dbs = client.db(this.dbName);
				this.l = this.l + 1;
				const l = this.l;
				let b = setInterval(() => {
					console.error('AM NOIT CLOSED: ' + l, code, args);
				}, 5000);

				subj.next([dbs, () => {
					clearInterval(b);
					client.close();
				}]);
				subj.complete();
			}
		);
		return subj;
	}

	// get(code?: string, args?: any) {
	// 	const subj = new Subject<[Db, () => void]>();
	// 	const fn = () => {
	// 		++this.waitCount;
			
	// 		//const i = this.queue.indexOf(fn);
	// 		//this.queue.splice(i, 1);
	// 					this.queue = this.queue.filter(q => q !== fn);
	// 		this.getDb(subj, code, args)
	// 			.subscribe(
	// 				() => {},
	// 				() => {},
	// 				() => {
	// 				}
	// 			);
	// 	};
	// 	this.add(fn);
	// 	return subj;
	// }

	// private add(cb: any) {
	// 	this.queue.unshift(cb);
	// 	++this.stackHistory;
	// 	if(this.queue.length === 1) {
	// 		this.runNext();
	// 	}
	// }
	// private runNext() {
	// 	if(this.waitCount >= this.limit) {
	// 		// console.log('NO');
	// 		return;
	// 	}
	// 	// console.log('YES');
	// 	let next = this.queue[0];
	// 	if(!next) {
	// 		return;
	// 	}

	// 	next();
	// 	this.runNext();
	// }

	// private getDb(subj? :Subject<[Db, () => void]>, code?: string, args?: any) {
	// 	subj = subj || new Subject<[Db, () => void]>();

	// 	const a = setInterval(() => {
	// 		console.log('WAIT CONNECTION');
	// 		console.log(this.waitCount);
	// 	}, 5000);
	// 	MongoClient.connect(
	// 		this.url, 
	// 		{

	// 			//connectTimeoutMS: 50000,
	// 			// socketTimeoutMS: 30000,
	// 			// poolSize: 20000,
	// 			useNewUrlParser: true
	// 			// ,
	// 			// autoReconnect: true,
	// 			// reconnectTries: Number.MAX_VALUE
	// 		}, 
	// 		(err, client) => {
	// 			clearInterval(a);
	// 			if (err) {
	// 				setTimeout(() => {
	// 					this.getDb(subj, code, args);
	// 					console.error('SOME MONGO ERROR', err);
	// 				}, (Math.random() * 700) + 3000);
	// 				return;
	// 				if (err.errorLabels && err.errorLabels.indexOf('TransientTransactionError') >= 0) {
	// 					console.error('TransientTransactionError, retrying transaction ...');
	// 					setTimeout(() => {
	// 						this.getDb(subj);
	// 					}, Math.random() * 1000);
	// 					return;
	// 				}
	// 				subj.error(err);
	// 				return;
	// 			}
	// 			// console.log('Success MOngod Db Connection');
	// 			const dbs = client.db(this.dbName);
	// 			this.l = this.l + 1;
	// 			const l = this.l;
	// 			let b;
	// 		//	if (l === 4) {
	// 				b = setInterval(() => {
	// 					console.error('AM NOIT CLOSED: ' + l, code, args);
	// 				}, 5000);
	// 				//console.log('OPENNED CONNECTION: ' + l);
	// 			//}
	// 			subj.next([dbs, () => {
	// 				//if (l === 4) {
	// 					//console.log('CLOCED CONNECTION ' + l);
	// 					clearInterval(b);
	// 				//}
	// 				client.close();
	// 				--this.waitCount;
	// 				this.runNext();
	// 			}]);
	// 			subj.complete();
	// 		}
	// 	);
	// 	return subj;
	// }
}