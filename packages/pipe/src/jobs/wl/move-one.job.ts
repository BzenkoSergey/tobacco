import { from, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';

import { ObjectId } from 'mongodb';
import { MongoDb } from '../../core/db';
import { MongoExtDb } from '../../core/db-ext';

import { async } from '../../async';
import { PipeInjector } from '../../pipes/pipe-injector.interface';
import { Messager } from '../../pipes/messager.interface';
import { Job } from '../job.interface';
import { DI, DIService } from '../../core/di';
import { ExtService } from '../../core/ext.service';

export class MoveOneJob implements Job {
	private options: any;
	private messager: Messager;
	private di: DI;
	private pipePath: string;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
		this.messager = messager;
	}

	setSchemeId() {
		return this;
	}

	setStaticOptions() {
		return this;
	}

	setDI() {
		return this;
	}

	destroy() {
		return this;
	}

	setPipePath() {
		return this;
	}

	run(info: any) {
		if (!info.aggregated) {
			return async(null);
		}
		const dbConfigs = info.db;
		const prop = this.options.prop;
		const toSave = {
			$set: info.aggregated
		};
		const url = 'mongodb://' + dbConfigs.ip + ':' + dbConfigs.port;
		const collection = this.options.collection;
		const query: any = {};
		query[prop] = info.aggregated[prop];
		return new MongoDb(collection, true, url, dbConfigs.db)
			.find(query)
			.pipe(
				mergeMap(d => {
					if (!d.length) {
						return new MongoDb(collection, true, url, dbConfigs.db)
							.insertOne(toSave.$set)
							.pipe(
								map(() => toSave.$set)
							);
					}

					return new MongoDb(collection, true, url, dbConfigs.db)
						.replaceOne({ _id: d[0]._id }, toSave.$set, {})
						.pipe(
							map(() => toSave.$set)
						);
				})
			)
	}
}