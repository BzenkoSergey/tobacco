import { from, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';

import { ObjectId } from 'mongodb';
import { MongoDb } from './../../core/db';
import { MongoExtDb } from './../../core/db-ext';

import { async } from './../../async';
import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { ExtService } from './../../core/ext.service';

export class MoveJob implements Job {
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
		const dbConfigs = info.db;
		const toSave = {
			$set: {
				menu: info.items
			}
		};
		let url = 'mongodb://' + dbConfigs.ip + ':' + dbConfigs.port;
		if (dbConfigs.query) {
			url = url + '/?' + dbConfigs.query;
		}
		const collection = this.options.collection;
		return new MongoDb(collection, true, url, dbConfigs.db)
			.find({})
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