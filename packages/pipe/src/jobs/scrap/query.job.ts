const cheerio = require('cheerio');
// import * as URL from 'URL';
import { async } from './../../async';
import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from '../job.interface';
import { DI, DIService } from '../../core/di';
import { Store } from './../../core/store';

export class QueryJob implements Job {
	private store: Store;
	private di: DI;
	private pipePath: string;
	staticOptions: any;
	options: any;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
	}

	destroy() {
		return this;
	}
	
	setStaticOptions(options: any) {
		this.staticOptions = options;
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

	setSchemeId(schemeId: string) {
		return this;
	}

	run(d: string) {
		const pageUrl = this.options.url;
		const param = this.options.param;

		const urlInfo = new URL(pageUrl);
		const urlQueries = urlInfo.searchParams;
		urlQueries.append(param, d);
		return async(urlInfo.href);
	}
}