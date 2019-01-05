import { from, Subject, BehaviorSubject } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';

import { MongoDb } from './../../core/db';

import { async } from './../../async';
import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { ExtService } from './../../core/ext.service';

export class NotificationJob implements Job {
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

	destroy() {
		return this;
	}

	run(data: any) {
		const unitId = data.aggregated.productId;
		const resourceId = data.resourceId;

		return new MongoDb('notification', true)
			.insertOne({
				code: 'AGGREGATED_UNIT',
				data: {
					unitId: unitId,
					resourceId: resourceId
				},
				createdDate: Date.now().toString()
			})
			.pipe(
				map(d => d.insertedId)
			);
	}
}