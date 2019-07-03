import { map } from 'rxjs/operators';

import { ObjectID } from 'mongodb';
import { MongoExtDb } from './../../core/trash/db-ext';

import { PipeInjector } from './../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';

export class ResourceSettingsJob implements Job {
	private options: any;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
	}

	run() {
		const resourceId = this.options.resourceId;

		return new MongoExtDb('resource')
			.findOne({
				_id: new ObjectID(resourceId)
			})
			.pipe(
				map(settings => {
					return {
						settings
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

	setDI() {
		return this;
	}

	destroy() {
		return this;
	}

	setPipePath() {
		return this;
	}
}