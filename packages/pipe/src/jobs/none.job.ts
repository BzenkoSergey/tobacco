import { from, Subject, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { async } from './../async';
import { PipeInjector } from '../core/pipe-injector.interface';
import { Messager } from '../core/messager.interface';
import { Job } from './job.interface';
import { DI } from './../core/di';
let a = 4;
export class NoneJob implements Job {
	private options: any;
	private messager: Messager;
	private di: DI;
	private pipePath: string;

	constructor(options: any, injector: PipeInjector, messager: Messager) {
		this.options = options;
		this.messager = messager;
	}

	setStaticOptions(options: any) {
		return this;
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

	run(result: string) {
		return async(result);
	}
}