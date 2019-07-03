import { Subject, from } from 'rxjs';

import { async } from './../async';
import { HttpStack } from '../core/services/http-stack';
import { PipeInjector } from '../core/pipe-injector.interface';
import { Messager } from '../core/messager.interface';
import { Job } from './job.interface';
import { DI, DIService } from './../core/di';

export class HttpJob implements Job {
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

	run(data: any) {
		let result = typeof data === 'string' ? data : data.url;
		let emitError = true;
		if (this.options && this.options.emitError !== undefined) {
			emitError = this.options.emitError
		}
		
		this.httpStack = this.di.get<HttpStack>(this.pipePath, DIService.HTTP_STACK);
		const subj = new Subject<{ html: string, url: string }|'$stop'>();

		const protocol = result.startsWith('https') ? 'HTTPS' : 'HTTP';
		let html = '';
		// console.log('HTTP ' + this.options);
		this.httpStack.get(
			result,
			(data: string) => {
				html += data.toString();
			},
			() => {
				// console.log('http real');
				const res = {
					html: html,
					url: result
				}
				let d = {
					...res
				}
				if (typeof data !== 'string') {
					d = {
						...d,
						...data
					}
				}

				subj.next(d);
				subj.complete();
			},
			e => {
				if (emitError) {
					console.log(result);
					subj.error(e);
				} else {
					subj.next('$stop');
					subj.complete();
				}
			},
			protocol
		);
		return subj;
	}
}