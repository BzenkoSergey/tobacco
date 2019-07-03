import { from, Subject, BehaviorSubject, timer } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import * as schedule from 'node-schedule';
import * as moment from 'moment';

import { async } from './../../async';
import { PipeInjector } from '../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { Navigator } from '../../core/services/navigator';
import { Manipulator } from '../../core/services/manipulator';

export class ItemsDelayJob implements Job {
	private options: any;
	private messager: Messager;
	private di: DI;
	private pipePath: string;
	private navigator: Navigator;
	private manipulator: Manipulator;

	constructor(options: any, injector: PipeInjector, messager: Messager) {
		this.options = options;
		this.messager = messager;
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

	setStaticOptions(options: any) {
		return this;
	}

	run(data: any[]) {
		const now = moment(new Date())
		let end = moment(new Date()).hours(23).minutes(59);
		if (this.options && this.options.executionTime) {
			end = moment(new Date()).add(this.options.executionTime, 'minutes');
		}
		// const end = moment().utc().endOf('day');
		const diffs = end.valueOf() - now.valueOf();

		const count = data.length;
		let delay = diffs / count;
		if (this.options && this.options.interval) {
			delay = this.options.interval;
		}
		let last = now.valueOf();

		const list = data.map((v, i) => {
			if (i) {
				last = last + delay;
			}
			return {
				delay: new Date(last).toString(),
				date: true,
				data: v
			}
		});

		console.log(list.map(i => i.delay));

		return async(list);
	}
}