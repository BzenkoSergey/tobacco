import { PipeInjector } from '../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { async } from './../../async';
import { Store } from '../../core/services/store';

export class ResourceFilterPropsJob implements Job {
	private options: any;
	private di: DI;
	private pipePath: string;
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
		this.di = di;
		return this;
	}

	setSchemeId(schemeId: string) {
		return this;
	}

	setPipePath(path: string) {
		this.pipePath = path;
		return this;
	}

	setStaticOptions(options: string) {
		this.staticOptions = JSON.parse(options);
		return this;
	}

	run(dom: any) {
		const store = this.di.get<Store>(this.pipePath, DIService.STORE);
		const processed = store.get('PROCESSED') || [];

		const d = dom.data || dom;
		if (!!~processed.indexOf(d.target) || !dom.data) {
			return async('$stop');
		}
		dom.data.price = dom.price;
		const stop = this.options.some(s => {
			const v = d[s.prop] || '';
			if (!s.reg) {
				return Array.isArray(v) ? !v.length : !v;
			}
			if (Array.isArray(v)) {
				const status = v.some(value => {
					const r = value.match(new RegExp(s.reg));
					return r && r.length;
				});
				return !v.length || status;
			}
			const r = v.match(new RegExp(s.reg));
			return r && r.length;
		});

		if (stop) {
			return async('$stop');
		}

		processed.push(d.target);
		store.set('PROCESSED', processed);
		return async(dom);
	}
}
