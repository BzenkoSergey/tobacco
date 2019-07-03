import { BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { async } from './../async';
import { PipeInjector } from '../core/pipe-injector.interface';
import { Messager } from '../core/messager.interface';
import { Job } from './job.interface';
import { DI } from './../core/di';
let a = 4;
export class TJob implements Job {
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

	setStaticOptions(options: any) {
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
		if (result) {
			console.log('t mock', result);
			return async(result);
		}
		console.log('t real', this.options.length);

		const s = new Subject<any>();
		setTimeout(() => {
			s.next(this.options.length);
			s.complete();
		}, 1000);
		return s
		.pipe(
				tap(() => {
					// if (a > 10) {
					// 	return;
					// }
					// a  = a + 1;
					// this.messager('REPEAT_GROUP', {
					// 	url: 'https://www.alkalyans.ru',
					// 	protocol : 'HTTPS'
					// });
				})
				);

		// return of(this.options.length)
		// 	.pipe(
		// 		tap(() => {
		// 			if (!a) {
		// 				return;
		// 			}
		// 			a = false;
		// 			this.messager('REPEAT_GROUP', {
		// 				url: 'https://www.alkalyans.ru',
		// 				protocol : 'HTTPS'
		// 			});
		// 		})
		// 	);
	}
}