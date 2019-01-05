import { from, Subject, BehaviorSubject, timer, interval } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';

import * as schedule from 'node-schedule';
import * as moment from 'moment';

import { async } from './../async';
import { PipeInjector } from './../pipes/pipe-injector.interface';
import { Messager } from './../pipes/messager.interface';
import { Job } from './job.interface';
import { DI, DIService } from './../core/di';
import { Navigator } from './../core/navigator';
import { Manipulator } from './../core/manipulator';

export class DelayJob implements Job {
	private subj = new Subject<any>();
	private task: any;

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

	destroy() {
		this.subj.complete();
		this.subj = new Subject<any>();
		if (!this.task) {
			return this;
		}
		this.task.cancel();
		return this;
	}

	run(data: any) {
		let delay = data.delay || this.options.delay;
		const interval = data.interval || this.options.interval;
		const date = data.date || this.options.date;
		if (delay === undefined) {
			return async('$stop');
		}
		if (date) {
			delay = new Date(delay);
		}
		
		this.task = schedule.scheduleJob(delay, () => {
			this.next(data.data || data, interval);
		});

		if (!this.task) {
			setTimeout(() => {
				this.next(data.data || data, interval);
			});
		} else {
			console.log(this.task.nextInvocation(), '=====');
			const nextDate = this.task.nextInvocation();
			const nextDateMoment = moment(nextDate.toISOString());
			const nowMoment = moment(new Date());
			const isAfter = moment(nowMoment).isAfter(nextDateMoment);
			// console.log(isAfter, delay, '=====22');
			if (isAfter) {
				setTimeout(() => {
					this.next(data.data || data, interval);
				});
			}
		}

		return this.subj;
	}

	private next(data: any, interval = false) {
		this.subj.next(data);
		if (!interval || !this.task || !this.task.nextInvocation()) {
			this.subj.complete();
		}
		if (!interval && this.task) {
			this.task.cancel();
		}
	}
}