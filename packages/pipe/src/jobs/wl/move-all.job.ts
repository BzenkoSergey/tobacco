import { ObjectId } from 'mongodb';
import { MongoDb } from './../../core/db';

import { throwError, Observable } from 'rxjs';
import { tap, mergeMap, catchError, delay, map, merge } from 'rxjs/operators';

import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { Store } from './../../core/store';
import { async } from './../../async';

export class MoveAllJob implements Job {
	private db: MongoDb;
	private options: any;
	private di: DI;
	staticOptions: any;
	private pipePath: string;

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
		this.di = di;
		return this;
	}

	setPipePath(path: string) {
		this.pipePath = path;
		return this;
	}

	setStaticOptions(options: string) {
		return this;
	}

	run(d: any) {
		const collection = this.options.collection;
		const store = this.di.get<Store>(this.pipePath, DIService.STORE);
		const dbConfigs = store.get('WL_DB');
		let subj: Observable<any>;
		if(dbConfigs) {
			subj = async(dbConfigs);
		} else {
			subj = this.getDb()
				.pipe(
					map(c => {
						store.set('WL_DB', c);
						return c;
					})
				);
		}

		return subj
			.pipe(
				mergeMap(dbConfigs => {
					return new MongoDb(collection, true)
						.find({})
						.pipe(
							map(list => [list, dbConfigs])
						);
				}),
				mergeMap(d => {
					const list = d[0];
					const dbConfigs = d[1];
					let url = 'mongodb://' + dbConfigs.ip + ':' + dbConfigs.port;
					if (dbConfigs.query) {
						url = url + '/?' + dbConfigs.query;
					}

					return new MongoDb(collection, true, url, dbConfigs.db)
						.insertMany(list)
						.pipe(
							map(() => {
								return d;
							})
						)
				})
			);
	}

	private getDb() {
		return new MongoDb('wl', true)
			.find({})
			.pipe(
				map(d => {
					return d[0].db;
				})
		)
	}
}