import { ObjectId } from 'mongodb';
import { MongoDb } from './../../core/trash/db';

import { throwError } from 'rxjs';
import { tap, mergeMap, catchError, delay, map } from 'rxjs/operators';

import { PipeInjector } from '../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';

export class DBCreateJob implements Job {
	private db: MongoDb;
	private options: any;
	private pipePath: string;
	staticOptions: any;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
	}

	destroy() {
		return this;
	}

	setSchemeId(schemeId: string) {
		return this;
	}

	setDI(di: DI) {
		return this;
	}

	setPipePath(path: string) {
		this.pipePath = path;
		return this;
	}

	setStaticOptions(options: string) {
		return this;
	}
	deepValue(obj, path) {
		for (var i=0, path=path.split('.'), len=path.length; i<len; i++){
			obj = obj[path[i]];
		};
		return obj;
	}

	run(dom: any) {
		const collection = dom.collection || this.options.collection;
		let document = dom.document || dom.data || dom;
		if (this.options && this.options.dataPath) {
			document = this.deepValue(dom, this.options.dataPath);
		}
		let d = {};

		Object.keys(document)
			.forEach(p => {
				if (p === '_id') {
					return;
				}
				d[p] = document[p];
			});

		if(document.url === 'https://www.youtube.com/watch?v=f4EYvJK_1s0') {
			console.warn(this.pipePath);
		}
		return new MongoDb(collection, true)
			.insertOne(d)
			.pipe(
				map(r => {
					dom.id = r.insertedId;
					return dom;
				}),
				catchError(e => {
					return throwError(e);
				})
			);
	}
}