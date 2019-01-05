import { ObjectId } from 'mongodb';
import { MongoDb } from './../../core/db';

import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';

export class DBGetListJob implements Job {
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

	setDI(di: DI) {
		return this;
	}

	setPipePath(path: string) {
		return this;
	}

	setStaticOptions(options: string) {
		return this;
	}

	setSchemeId(schemeId: string) {
		return this;
	}

	run(dom: any) {
		dom = dom || {};
		const collection = dom.collection || this.options.collection;
		const query = dom.query || this.options.query;
		const limit = dom.limit || this.options.limit;
		const skip = dom.skip || this.options.skip;
		const sort = dom.sort || this.options.sort;
	
		if (dom.aggregate) {
			return new MongoDb(collection, true)
				.aggregate(this.processQueries(query, '$id-'));
		}
		return new MongoDb(collection, true)
			.find(this.processQueries(query), null, limit, skip, sort);
	}

	destroy() {
		return this;
	}

	private processQueries(obj: any, idMark = '$') {
		if (typeof obj === 'boolean') {
			return obj;
		}
		if (typeof obj === 'string') {
			if (obj.startsWith(idMark)) {
				return ObjectId(obj.replace(idMark, ''));
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
			return obj.map(i => this.processQueries(i, idMark));
		}
		const o: any = {};
		Object.keys(obj)
			.forEach(p => {
				o[p] = this.processQueries(obj[p], idMark);
			});
		return o;
	}
}