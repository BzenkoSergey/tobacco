import { PipeInjector } from '../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';
import { async } from './../../async';

export class UtilsFilterPropsJob implements Job {
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
		const d = dom.data || dom;
		const filters = Array.isArray(this.options) ? this.options : this.options.filters;
		const inverse = Array.isArray(this.options) ? false : this.options.inverse;
		const stop = filters.some(s => {
			if (inverse) {
				return !!d[s];
			}
			return !d[s];
		});

		if (stop) {
			return async('$stop');
		}
		return async(dom);
	}
}
