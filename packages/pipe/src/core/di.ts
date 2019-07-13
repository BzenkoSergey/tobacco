import { HttpStack } from './services/http-stack';
import { Navigator } from './services/navigator';
import { Manipulator } from './services/manipulator';
import { Store } from './services/store';
import { ExtService } from './services/ext.service';
import { SchemeProcessService } from './services/scheme-process.service';
import { DbService } from './trash/db.service';
import { Session } from './services/session.service';
import { ProxyService } from './services/proxy.service';

export enum DIService {
	HTTP_STACK = 'HTTP_STACK',
	NAVIGATOR = 'NAVIGATOR',
	MANIPULATOR = 'MANIPULATOR',
	STORE = 'STORE',
	EXT = 'EXT',
	SCHEME_PROCESS = 'SCHEME_PROCESS',
	DB = 'DB',
	SESSION = 'SESSION',
	PROXY = 'PROXY'
}

export class DI {
	private services = new Map<DIService, any>();
	private register = new Map<string, DIService[]>();
	private created = new Map<string, any[]>();
	private rootAllowed = [DIService.NAVIGATOR, DIService.MANIPULATOR, DIService.SCHEME_PROCESS, DIService.DB];

	constructor() {
		this.services.set(DIService.HTTP_STACK, HttpStack);
		this.services.set(DIService.NAVIGATOR, Navigator);
		this.services.set(DIService.MANIPULATOR, Manipulator);
		this.services.set(DIService.STORE, Store);
		this.services.set(DIService.EXT, ExtService);
		this.services.set(DIService.SCHEME_PROCESS, SchemeProcessService);
		this.services.set(DIService.DB, DbService);
		this.services.set(DIService.SESSION, Session);
		this.services.set(DIService.PROXY, ProxyService);
	}

	registrate(path: string, service: DIService) {
		const list = this.register.get(path) || [];
		if (!!~list.indexOf(service)) {
			return;
		}
		list.push(service);
		this.register.set(path, list);
	}

	get<T>(path: string, service: DIService): T {
		const allowedPath = this.getAllowedPathByHierarchy(path, service);
		if (allowedPath === null || allowedPath === undefined) {
			throw 'DI: service: ' + service + ' is not allowed for path: ' + path;
		}
		const list = this.created.get(allowedPath) || [];
		const serviceClass = this.services.get(service);
		let inst = list.find(s => s instanceof serviceClass);
		if (!inst) {
			inst = new serviceClass();
			list.push(inst);
			this.created.set(allowedPath, list);
		}
		return inst;
	}

	private allowed(path: string, service: DIService) {
		const list = this.register.get(path) || [];
		return !!~list.indexOf(service);
	}

	private isRootAllowed(service: DIService) {
		return !!~this.rootAllowed.indexOf(service);
	}

	private getAllowedPathByHierarchy(path: string, service: DIService) {
		if (this.isRootAllowed(service)) {
			return '';
		}
		if (this.allowed(path, service)) {
			return path;
		}

	
		const hierarchical: string[] = [''];
		path
			.split(/(?<=[0-9])(\.)/g)
			.filter(i => i !== '.')
			.forEach((segment, i) => {
				const s = i ? hierarchical[i - 1] + '.' + segment : segment;
				if (path !== s) {
					hierarchical.unshift(s);
				}
			});

		if (!hierarchical.length) {
			return null;
		}
		return hierarchical
			.find(segment => this.allowed(segment, service));
	}
}