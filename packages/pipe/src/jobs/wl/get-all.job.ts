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

export class GetAllJob implements Job {
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
		return new MongoDb('wl', true)
			.find({})
			.pipe(
				map(d => {
					return {
						...info,
						items: d[0].menu
					};
				})
			)
	}
}