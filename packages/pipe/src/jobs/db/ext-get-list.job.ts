import { ObjectId } from 'mongodb';
import { MongoExtDb } from './../../core/db-ext';

import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';

export class DBExtGetListJob implements Job {
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

	run(dom: any) {
		dom = dom || {};
		const collection = dom.collection || this.options.collection;
		const query = dom.query || this.options.query;
		const limit = dom.limit || this.options.limit;
		const skip = dom.skip || this.options.skip;
		const sort = dom.sort || this.options.sort;

		return new MongoExtDb(collection, true)
			.find(this.processQueries(query), null, limit, skip, sort);
	}

	private processQueries(obj: any) {
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