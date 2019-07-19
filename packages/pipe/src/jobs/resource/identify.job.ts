import { combineLatest } from 'rxjs';
import { map, mergeMap, filter, scan } from 'rxjs/operators';

import { MongoExtDb } from './../../core/trash/db-ext';

import { PipeInjector } from './../../core/pipe-injector.interface';
import { DI, DIService } from './../../core/di';
import { Store } from '../../core/services/store';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';

export class ResourceIdentifysJob implements Job {
	private options: any;
	private di: DI;
	private pipePath: string;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
	}

	run(d: { data: any[], settings: any}) {
		const store = this.di.get<Store>(this.pipePath, DIService.STORE);
		const resourceMinDate = store.get('resourceMinDate') || Date.now();
		store.set('resourceMinDate', resourceMinDate);
		const resourceId = d.settings._id.toString();

		const obs = d.data
			.filter(i => {
				if (!i.date) {
					return true;
				}
				return i.date >= resourceMinDate;
			})
			.map(i => {
				return new MongoExtDb('resource-item')
					.findOne({
						resource: resourceId,
						itemId: i.itemId
					})
					.pipe(
						map(status => {
							return status ? null : i;
						})
					);
			});

		return combineLatest(...obs)
			.pipe(
				map(list => {
					return list
						.filter(i => !!i)
						.map(i => {
							i.settings = d.settings;

							const store = this.di.get<Store>(this.pipePath, DIService.STORE);

							const definedDate = Date.now();
							const key = 'short_' + i.itemId;
							if (!store.get(key)) {
								i.definedDate = definedDate;
								store.set(key, definedDate.toString());
							}

							return i;
						})
				}),
				map(info => {
					return {
						...d,
						toCreate: info
					}
				})
			);
	}

	setSchemeId() {
		return this;
	}

	setStaticOptions() {
		return this;
	}

	destroy() {
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
}