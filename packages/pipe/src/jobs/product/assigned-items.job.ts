import { from, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';

import { ObjectId } from 'mongodb';
import { MongoDb } from './../../core/trash/db';
import { MongoExtDb } from '../../core/trash/db-ext';

import { async } from './../../async';
import { PipeInjector } from '../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { ExtService } from '../../core/services/ext.service';

// get products per resource
// detect time per date
// calculate delay
// addChild by delay
// new infinity pipe

export class AssignedItemsJob implements Job {
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

	destroy() {
		return this;
	}

	setSchemeId(schemeId: string) {
		return this;
	}

	setStaticOptions(options: any) {
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

	// info.data = array or item
	/*
		{
			data: {
				productiD
			}
		}
	*/
	run(resourceId: string|any) {
		if (typeof resourceId === 'object' && resourceId) {
			if (!resourceId._id) {
				return async([]);
			}
			resourceId = resourceId._id.toString()
		}

		if (!resourceId) {
			return async([]);
		}

		const prop = this.options.prop || 'url';

		return this.getAssignedItems(resourceId)
			.pipe(
				map(items => {
					const unitIds = [];
					items.forEach(i => {
						if (!!~unitIds.indexOf(i[prop])) {
							return;
						}
						unitIds.push(i);
					});
					return unitIds;
				})
			);
	}

	private getAssignedItems(resourceId: string) {
		return this.getProcessedItems(resourceId)
			.pipe(
				mergeMap(items => {
					const ids = items.map(i => i._id.toString());

					return this.getUnitItems(ids)
						.pipe(
							map(unitItems => {
								const itemProcessedIds = unitItems.map(i => i.itemProcessedId);
								return items.filter(i => {
									return itemProcessedIds.includes(i._id.toString());
								});
							})
						);
				})
			);
	}

	private getProcessedItems(resourceId: string) {
		return new MongoDb('resource-processed-item', true)
			.find({
				resource: resourceId
			});
	}

	private getUnitItems(processedItemsIds: string[]) {
		return new MongoDb('unit-item', true)
			.find({
				itemProcessedId: {
					$in: processedItemsIds
				}
			});
	}
}