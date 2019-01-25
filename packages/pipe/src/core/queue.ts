import { Subject, Observable } from 'rxjs';

export class Queue {
	private waiting = 0;
	private queue: (() => void)[] = [];

	constructor(
		private asyncLimit = 1
	) {}

	destroy() {
		this.queue = [];
		this.waiting = 0;
	}

	run(f: () => Observable<any|{}>): Observable<any|{}> {
		const subj = new Subject<any>();
		const fn = () => {
			++this.waiting;
			this.queue = this.queue.filter(q => q !== fn);

			f().subscribe(
				d => subj.next(d),
				e => subj.error(e),
				() => {
					subj.complete();
					--this.waiting;
					this.runNext();
				}
			);
		};
		this.add(fn);
		return subj;
	}

	private add(cb: () => void) {
		this.queue.push(cb);

		if (this.queue.length === 1) {
			this.runNext();
		}
	}

	private runNext() {
		if (this.waiting >= this.asyncLimit) {
			return;
		}

		const next = this.queue[0];
		if (!next) {
			return;
		}

		next();
		this.runNext();
	}
}