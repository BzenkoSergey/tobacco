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

export class DbManager {
	private stackHistory = 0;
	private waitCount = 0;

	queue: any[] = [];
	connections: any[] = [];
	limit = 1;

	constructor(
		private url = 'mongodb://localhost:27017',
		private dbName = 'tobacco'
	) {
	}

	get() {
		const subj = new Subject<[Db, () => void]>();
		const fn = () => {
			++this.waitCount;
			const i = this.queue.indexOf(fn);
			this.queue.splice(i, 1);
			this.getDb(subj);
		};
		this.add(fn);
		return subj;
	}

	private add(cb: any) {
		this.queue.unshift(cb);
		++this.stackHistory;
		if(this.queue.length === 1) {
			this.runNext();
		}
	}
	private runNext() {
		if(this.waitCount >= this.limit) {
			// console.log('NO');
			return;
		}
		// console.log('YES');
		let next = this.queue[0];
		if(!next) {
			return;
		}

		next();
		this.runNext();
	}

	private getDb(subj? :Subject<[Db, () => void]>) {
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
						console.error('TransientTransactionError, retrying transaction ...');
						setTimeout(() => {
							this.getDb(subj);
						}, Math.random() * 1000);
						return;
					}
					subj.error(err);
					return;
				}
				// console.log('Success MOngod Db Connection');
				const dbs = client.db(this.dbName);
				subj.next([dbs, () => {
					client.close();
					--this.waitCount;
					this.runNext();
				}]);
				subj.complete();
			}
		);
		return subj;
	}
}