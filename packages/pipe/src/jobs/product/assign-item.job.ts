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

// - unitId

// - get Unit
// - get Company
// - get Line
// - get Attrs
// - get Categories

// - get ResourceItemProccesseds
// - get Resources
// - get that are mathed wit unit-item
// 
// => unit-aggregated



// "search"
// "productLine"
// "readableName"
// "name"
// "productId"
// "company"

export class AssignItemJob implements Job {
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

	run(info: any) {
		const item = info.data;
		const url = item.url;
		if (!url || !item.productId) {
			return async('$stop');
		}
		return this.getAssignedItems(url)
			.pipe(
				mergeMap(items => {
					if (!items) {
						return async('$stop');
					}
					return async(info);
				})
			);
	}

	destroy() {
		return this;
	}

	private getAssignedItems(url: string) {
		return this.getProcessedItems(url)
			.pipe(
				mergeMap(items => {
					const ids = items.map(i => i._id.toString());

					return this.getUnitItems(ids)
						.pipe(
							mergeMap(unitItem => {
								if (!unitItem) {
									return async(false);
                                }
                                return this.updateUnitItem(unitItem._id, ids[ids.length - 1])
							})
						);
				})
			);
	}

	private updateUnitItem(itemUnitId: string, itemProcessedId: string) {
		return new MongoDb('unit-item', true)
			.updateOne(
                {
                    _id: ObjectId(itemUnitId)
                },
                {
                    $set: {
                        itemProcessedId: itemProcessedId
                    }
                }
            );
	}

	private getUnitItems(processedItemsIds: string[]) {
		return new MongoDb('unit-item', true)
			.findOne({
				itemProcessedId: {
					$in: processedItemsIds
				}
			});
	}

	private getProcessedItems(url: string) {
		return new MongoDb('resource-processed-item', true)
			.find({
				url: url
			});
	}
}