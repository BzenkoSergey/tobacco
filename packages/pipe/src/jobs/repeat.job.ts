import { from, Subject, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { async } from './../async';
import { PipeInjector } from '../core/pipe-injector.interface';
import { Messager } from '../core/messager.interface';
import { Job } from './job.interface';
import { DI, DIService } from './../core/di';
import { Navigator } from '../core/services/navigator';
import { Manipulator } from '../core/services/manipulator';

let a = 0;
export class RepeatJob implements Job {
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

	run(result: string) {
		// console.log(result);
		if(a < 3) {
			this.navigator = this.di.get<Navigator>(this.pipePath, DIService.NAVIGATOR);
			this.manipulator = this.di.get<Manipulator>(this.pipePath, DIService.MANIPULATOR);
			const group = this.navigator.getParentGroup(this.pipePath);
			const pipe = this.navigator.getPipe(this.pipePath);
			const pipeToRepeat = this.navigator.getChildOf(group, pipe);
			this.manipulator.repeat(group, pipeToRepeat, result);	
		}
		a = a + 1;
		// console.log(group);
		if (result) {
			console.log('repeat mock', result);
			// return from([result]);
			return async(result);
		}

		console.log('repeat', result, this.options);
		// const f = new Subject();
		// setTimeout(() => {
		// 	f.next(1);
		// 	f.complete();
		// });
		// return from([1]);
		return async(1);
	}
}