import { ObjectId } from 'mongodb';
import { MongoExtDb } from './../../core/db-ext';

import { throwError } from 'rxjs';
import { tap, mergeMap, catchError, delay, map } from 'rxjs/operators';

import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';

export class DBExtCreateJob implements Job {
	private db: MongoExtDb;
	private options: any;
	staticOptions: any;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
	}

	setSchemeId(schemeId: string) {
		return this;
	}

	setDI(di: DI) {
		return this;
	}

	destroy() {
		return this;
	}

	setPipePath(path: string) {
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
		let document = dom.document || dom.data;
		if (this.options.dataPath) {
			document = this.deepValue(dom, this.options.dataPath);
		}
		return new MongoExtDb(collection, true)
			.insertOne(document)
			.pipe(
				map(r => {
					return r.insertedId;
				}),
				catchError(e => {
					return throwError(e);
				})
			);
	}
}