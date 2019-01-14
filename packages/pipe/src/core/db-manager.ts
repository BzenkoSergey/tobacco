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
	limit = 20;

	constructor(
		private url = 'mongodb://127.0.0.1:27017',
		private dbName = 'tobacco'
	) {
	}

	get() {
		const subj = new Subject<[Db, () => void]>();
		const fn = () => {
			++this.waitCount;
			this.queue = this.queue.filter(q => q !== fn);
			
			//const i = this.queue.indexOf(fn);
			//this.queue.splice(i, 1);
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

		const a = setInterval(() => {
			console.log('WAIT CONNECTION');
			console.log(this.waitCount);
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
						this.getDb(subj);
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
				// console.log('Success MOngod Db Connection');
				const dbs = client.db(this.dbName);
				const b = setInterval(() => {
					console.error('AM NOIT CLOSED');
				}, 5000);
				subj.next([dbs, () => {
					clearInterval(b);
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