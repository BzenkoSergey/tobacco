import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';
import { async } from './../../async';

export class UtilsFilterJob implements Job {
	private options: any;
	staticOptions: string[] = [];

	constructor(
		options: string[],
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
	}

	destroy() {
		return this;
	}

	setDI(di: DI) {
		return this;
	}

	setSchemeId(schemeId: string) {
		return this;
	}

	setPipePath(path: string) {
		return this;
	}

	setStaticOptions(options: string) {
		this.staticOptions = JSON.parse(options);
		return this;
	}

	run(dom: any) {
		const items = dom.data.filter(o => {
			return this.options.some(s => {
				return new RegExp(s, 'ig').test(o);
			});
		})
		return async({
			...dom,
			data: items
		});
	}
}
