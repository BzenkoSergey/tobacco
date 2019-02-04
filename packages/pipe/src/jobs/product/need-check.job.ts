const cheerio = require('cheerio');
import * as URL from 'url';
import { async } from './../../async';
import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';

export class NeedCheckJob implements Job {
	private options: any;
	staticOptions: any;
	schemeId: string;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
	}

	setDI(di: DI) {
		return this;
	}

	setPipePath(path: string) {
		return this;
	}

	setSchemeId(schemeId: string) {
		this.schemeId = schemeId;
		return this;
	}

	setStaticOptions(options: string) {
		this.staticOptions = JSON.parse(options);
		return this;
	}

	run(dom: any) {
        let allow = true;
		try {
			const d = cheerio.load(dom.dom).root().find('html');
            const $el = d.find('link[rel="canonical"]');
			const canonical = ($el.attr('href') || '').trim();
            if (canonical) {
				const canonicalInfo = URL.parse(canonical);
				const urlInfo = URL.parse(dom.url);
                allow = urlInfo.path === canonicalInfo.path;
            } else {
                allow = true;
            }
		} catch(e) {
            console.error(e);
            allow = true;
		}

        if (allow) {
            return async(dom);
        }
        return async('$stop');
	}

	destroy() {
		return this;
	}
}