import { from, Subject, BehaviorSubject, combineLatest, interval } from 'rxjs';
import { tap, map, mergeMap, delay } from 'rxjs/operators';

import { ObjectId } from 'mongodb';
import { MongoDb } from './../core/trash/db';
import { MongoExtDb } from '../core/trash/db-ext';

import { async } from './../async';
import { PipeInjector } from './../core/pipe-injector.interface';
import { Messager } from './../core/messager.interface';
import { Job } from './job.interface';
import { DI, DIService } from './../core/di';
import { ExtService } from '../core/services/ext.service';

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
		console.log(d.resourceId);
		return this.fetch(resourceId)
			.pipe(
				mergeMap(list => {
					let ig = 0;
					return from(list)
						.pipe(
							mergeMap((i: any) => {
								const info = new URL(i.url);
								info.protocol = protocol;
								i.url = info.toString();

								ig = ig + 100;
								const sub = new Subject();
								setTimeout(() => {
									console.log(i._id.toString(), i.url);
									new MongoDb('resource-processed-item')
										.updateOne(
											{
												_id: ObjectId(i._id.toString())
											},
											{
												$set: {
													url: i.url
												}
											}
										)
										.subscribe(
											d => sub.next(d),
											e => sub.error(e),
											() => sub.complete()
										);
								}, ig)
							
								return sub;
							})
						)
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