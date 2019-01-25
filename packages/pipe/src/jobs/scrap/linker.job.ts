const cheerio = require('cheerio');
import * as URL from 'URL';
import { async } from './../../async';
import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from '../job.interface';
import { DI, DIService } from '../../core/di';
import { Store } from './../../core/store';

export class LinkerJob implements Job {
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

	run(links: any) {
		this.store = this.di.get<Store>(this.pipePath, DIService.STORE);
		const added = [];
		const allLinks = this.store.get('LINKS') || new Map<string, boolean>();
		const urlInfo = URL.parse(links.url);

		links.data
			.filter(l => !!l)
			.map(l => {
				const info = URL.parse(l);
				if (l === '/') {
					return false;
				}
				if (l === '#' || l.startsWith('#')) {
					return false;
				}
				if (l.startsWith('tel:')) {
					return false;
				}
				if (!info.hostname) {
					if (!info.path) {
						debugger;
					}
					const path = info.path.startsWith('/') ? info.path : '/' + info.path;
					return urlInfo.protocol.replace(':', '') + '://' + urlInfo.hostname + path;
				}
				if(info.protocol !== urlInfo.protocol) {
					return false;
				}
				if (info.hostname !== urlInfo.hostname) {
					return false;
				}
				if (info.port) {
					return false;
				}
				return l;
			})
			.filter(l => {
				return !!l;
			})
			.forEach(l => {
				if (allLinks.has(l)) {
					return;
				}
				allLinks.set(l, true);
				added.push(l);
				// if (allLinks.includes(l)) {
				// 	return;
				// }
				// allLinks.push(l);
				// added.push(l);
			});

		this.store.set('LINKS', allLinks);
		return async(added);
	}
}