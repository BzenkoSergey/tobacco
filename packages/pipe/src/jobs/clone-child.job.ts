import { from, Subject, BehaviorSubject, zip } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

import { async } from '../async';
import { PipeInjector } from './../core/pipe-injector.interface';
import { Messager } from './../core/messager.interface';
import { Job } from './job.interface';
import { DI, DIService } from '../core/di';
import { Navigator } from '../core/services/navigator';
import { Manipulator } from '../core/services/manipulator';

export class CloneChildJob implements Job {
	private options: any;
	private di: DI;
	private pipePath: string;
	private navigator: Navigator;
	private manipulator: Manipulator;

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
		return this;
	}

	run(input) {
		if(!input.length && !this.options.single) {
			return async(null);
		}
		this.navigator = this.di.get<Navigator>(this.pipePath, DIService.NAVIGATOR);
		this.manipulator = this.di.get<Manipulator>(this.pipePath, DIService.MANIPULATOR);

		const group = this.navigator.getPipe(this.pipePath);
		const pipeToRepeat = group.getChildren()[0];

		return group.cloneChild(pipeToRepeat.getPath(), input, true);
	}
}