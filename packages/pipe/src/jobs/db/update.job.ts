import { ObjectId } from 'mongodb';
import { MongoDb } from './../../core/db';

import { throwError } from 'rxjs';
import { tap, mergeMap, catchError, delay, map } from 'rxjs/operators';

import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';

export class DBUpdateJob implements Job {
	private db: MongoDb;
	private options: any;
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
		const id = dom.id || this.options.id;
		let document = dom.document || dom.data;
		if (this.options.dataPath) {
			document = this.deepValue(dom, this.options.dataPath);
		}
		const obj: any = {};
		Object.keys(document)
			.forEach(p => {
				if (p === '_id') {
					return;
				}
				obj[p] = document[p];
			})
		return new MongoDb(collection, true)
			.updateOne(
				{
					_id: ObjectId(id)
				},
				{
					$set: obj
				}
			)
			.pipe(
				map(r => {
					return r.result;
				}),
				catchError(e => {
					return throwError(e);
				})
			);
	}
}