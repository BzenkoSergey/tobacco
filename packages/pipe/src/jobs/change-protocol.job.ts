import { from, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';

import { ObjectId } from 'mongodb';
import { MongoDb } from './../core/db';
import { MongoExtDb } from './../core/db-ext';

import { async } from './../async';
import { PipeInjector } from './../pipes/pipe-injector.interface';
import { Messager } from './../pipes/messager.interface';
import { Job } from './job.interface';
import { DI, DIService } from './../core/di';
import { ExtService } from './../core/ext.service';

export class ChangeProtocolJob implements Job {
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

	run(d: any) {
		const resourceId = d.resourceId;
		const protocol = d.protocol;
		return this.fetch(resourceId)
			.pipe(
				mergeMap(list => {
					const subjs = list.map(i => {
						const info = new URL(i.url);
						info.protocol = protocol;
						i.url = info.toString();

						return new MongoDb('resource-processed-item', true)
							.updateOne(
								{
									_id: i._id
								},
								{
									$set: {
										url: i.url
									}
								}
							);
					});
					return combineLatest(...subjs);
				})
			);
	}

	fetch(resourceId: string) {
		return new MongoDb('resource-processed-item', true)
			.find({
				resource: resourceId
			});
	}
}