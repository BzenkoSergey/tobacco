import { ObjectId } from 'mongodb';
import { MongoDb } from './../../core/trash/db';

import { PipeInjector } from '../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';

export class DBGetJob implements Job {
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

	run(dom: any) {
		return new MongoDb(dom.collection, true)
			.findOne({
				_id: ObjectId(dom.id)
			})
	}
}