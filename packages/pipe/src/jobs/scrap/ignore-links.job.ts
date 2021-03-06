import { PipeInjector } from '../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';
import { async } from './../../async';

export class IngoreLinksJob implements Job {
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

	setSchemeId(schemeId: string) {
		return this;
	}

	setDI(di: DI) {
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
		const items = dom.data
			.filter(o => !!o)
			.filter(o => {
				return this.options.every(s => {
					return !~o.indexOf(s.trim());
				});
			});

		// console.log(dom.links.length, items.length);
		return async({
			...dom,
			data: items
		});
	}
}