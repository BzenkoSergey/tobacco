import { BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { async } from './../async';
import { PipeInjector } from './../pipes/pipe-injector.interface';
import { Messager } from './../pipes/messager.interface';
import { Job } from './job.interface';
import { DI } from './../core/di';

export class VersionJob implements Job {
	private options: any;
	private messager: Messager;
	private di: DI;
	private pipePath: string;

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

	setStaticOptions(options: any) {
		return this;
	}

	setPipePath(path: string) {
		this.pipePath = path;
		return this;
	}

	run(result: any) {
		result.data.version = Date.now().toString();
		return async(result);
	}
}