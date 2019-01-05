import { ObjectId } from 'mongodb';
import { MongoDb } from './../../core/db';

import { throwError } from 'rxjs';
import { tap, mergeMap, catchError, delay, map } from 'rxjs/operators';

import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';

export class DBRemoveJob implements Job {
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

	setSchemeId(schemeId: string) {
		return this;
	}

	run(dom: any) {
		const collection = dom.collection || this.options.collection;
		const id = dom.id || this.options.id;
		let query = dom.query || this.options.query;
		if (!query) {
			query = {
				_id: ObjectId(id)
			}
		}

		console.log(query);
		console.log(this.processQueries(query));
		return new MongoDb(collection, true)
			.remove(
				this.processQueries(query)
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

	private processQueries(obj: any) {
		if(obj instanceof ObjectId) {
			return obj;
		}
		if (typeof obj === 'string') {
			if (obj.startsWith('$')) {
				return ObjectId(obj.substr(1));
			}
			return obj;
		}
		if (typeof obj === 'number') {
			return obj;
		}
		if (!obj) {
			return obj;
		}
		if (Array.isArray(obj)) {
			return obj.map(i => this.processQueries(i));
		}
		const o: any = {};
		Object.keys(obj)
			.forEach(p => {
				o[p] = this.processQueries(obj[p]);
			});
		return o;
	}
}