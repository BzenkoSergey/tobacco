import { Subject, from } from 'rxjs';

import { async } from './../async';
import { HttpStack } from './../core/http-stack';
import { PipeInjector } from './../pipes/pipe-injector.interface';
import { Messager } from './../pipes/messager.interface';
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

	run(result: string) {
		this.httpStack = this.di.get<HttpStack>(this.pipePath, DIService.HTTP_STACK);
		const subj = new Subject<{ html: string, url: string }>();

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
				subj.next({
					html: html,
					url: result
				});
				subj.complete();
			},
			e => {
				console.log(result);
				subj.error(e);
			},
			protocol
		);
		return subj;
	}
}