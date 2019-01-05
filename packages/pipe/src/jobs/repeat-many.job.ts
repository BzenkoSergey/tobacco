import { from, Subject, BehaviorSubject, zip } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

import { async } from '../async';
import { PipeInjector } from '../pipes/pipe-injector.interface';
import { Messager } from '../pipes/messager.interface';
import { Job } from './job.interface';
import { DI, DIService } from '../core/di';
import { Navigator } from '../core/navigator';
import { Manipulator } from '../core/manipulator';
let a = 0;
export class RepeatManyJob implements Job {
	private options: any;
	private di: DI;
	private pipePath: string;
	private navigator: Navigator;
	private manipulator: Manipulator;

	private done = 0;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
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
		this.done = 0;
		return this;
	}

	run(input) {
		if(!input.length) {
			return async(input);
		}
		this.navigator = this.di.get<Navigator>(this.pipePath, DIService.NAVIGATOR);
		this.manipulator = this.di.get<Manipulator>(this.pipePath, DIService.MANIPULATOR);
		const group = this.navigator.getParentGroup(this.pipePath);
		const pipe = this.navigator.getPipe(this.pipePath);
		const pipeToRepeat = this.navigator.getChildOf(group, pipe);

		a = a + 1;
		const subj = new Subject();
		this.next(group, pipeToRepeat, input, subj);
		// from(input.slice(0, 3))
		// 	.pipe(
		// 		mergeMap(r => {
		// 			return this.manipulator.repeat(group, pipeToRepeat, r || input);
		// 		})
		// 	)
		// 	.subscribe(
		// 		() => {},
		// 		err => subj.error(err),
		// 		() => subj.complete()
		// 	);

		return subj;
		// const obs = input.map(r => {
		// 	return this.manipulator.repeat(group, pipeToRepeat, r || input);
		// });
		// return zip(...obs)
		// 	.pipe(
		// 		mergeMap(() => {
		// 			return async(input);
		// 		})
		// 	);
	}

	private next(group: any, child: any, input: any[], subj: Subject<any>) {
		if (input.length < this.done + 1) {
			subj.next(input);
			subj.complete();
			return;
		}
		const i = input[this.done];
		this.manipulator.repeat(group, child, i || input)
			.subscribe(
				d => {},
				err => subj.error(err),
				() => {
					this.done = this.done + 1;
					this.next(group, child, input, subj);
				}
			)
	}
}