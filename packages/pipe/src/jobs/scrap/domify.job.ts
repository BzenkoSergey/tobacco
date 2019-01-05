const cheerio = require('cheerio');

import { async } from './../../async';
import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from '../job.interface';
import { DI } from '../../core/di';

export class DomifyJob implements Job {
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

	setSchemeId(schemeId: string) {
		return this;
	}

	setDI(di: DI) {
		return this;
	}

	setStaticOptions(options: any) {
		return this;
	}

	setPipePath(path: string) {
		return this;
	}

	run(html: any) {
		return async({
			url: html.url,
			dom: cheerio.load(html.html).root().toString()
		});
	}
}