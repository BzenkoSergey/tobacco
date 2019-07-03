import { Subject, from } from 'rxjs';

import { async } from './../async';
import { HttpStack } from '../core/services/http-stack';
import { PipeInjector } from './../core/pipe-injector.interface';
import { Messager } from './../core/messager.interface';
import { Job } from './job.interface';
import { DI, DIService } from './../core/di';

export class UnwrapJob implements Job {
	private httpStack: HttpStack;
	private options: any;
	private messager: Messager;
	private di: DI;
	private pipePath: string;

	constructor(options: any, injector: PipeInjector, messager: Messager) {
		this.options = options;
		// this.httpStack = injector(HttpStack);
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

	run(result: any) {
		return async<any[]>(result.data);
	}
}