import * as https from 'https';
import * as http from 'http';
import * as url from 'url';

import { Subject } from 'rxjs';

import { PipeInjector } from '../core/pipe-injector.interface';
import { Messager } from '../core/messager.interface';
import { Job } from './job.interface';
import { DI, DIService } from './../core/di';
import { Store } from './../core/services/store';

export class RequestJob implements Job {
	private options: any;
	private di: DI;
	private pipePath: string;

	constructor(options: any, injector: PipeInjector, messager: Messager) {
		this.options = options;
	}

	run(data: any) {
		const urlInfo = url.parse(this.options.apiUrl);
		let method: any = (urlInfo.protocol === 'https:')? https : http;
		const encoded = this.isEncoded(urlInfo.path);
		let uri = urlInfo.path;

		if (encoded) {
			uri = decodeURI(uri);
		}
		uri = encodeURI(uri);

		let obj = data;
		if (this.options.dataProp) {
			obj = data[this.options.dataProp];
		}
		obj.resource = obj.resourceFrom
		if (this.options.wrapArray) {
			obj = [obj];
		}
		const subj = new Subject();

		const store = this.di.get<Store>(this.pipePath, DIService.STORE);
					
		const savedDate = Date.now();
		const key = 'full_' + obj.itemId;
		if (!store.get(key)) {
			const definedDateKey = 'short_' + obj.itemId;
			obj.savedDate = savedDate;
			obj.definedDate = store.get(definedDateKey);
			obj.flag = 'CODE';
			store.set(key, savedDate.toString());
		}
	
		const toSend = JSON.stringify(obj) as any;
		method.request({
			hostname: urlInfo.hostname,
			path: uri,
			port: urlInfo.port,
			method: this.options.method,
			protocol: urlInfo.protocol,
			agent: false,
			headers: {
				...this.options.headers,
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(toSend)
			}
		}, (res: any) => {
			res.setEncoding('utf8');

			res.on('data', (d) => {
				console.log('RESSSSPONSEEEEEE');
				console.log(JSON.stringify(d));
			});
			res.on('end', () => {
				subj.next(toSend);
				subj.complete();
			});
		})
		.on('error', (e: any) => {
			subj.error(e);
		})
		.write(toSend);

		return subj.asObservable();
	}

	destroy() {
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

	setStaticOptions(options: any) {
		return this;
	}

	private isEncoded(uri: string) {
		uri = uri || '';
	  
		return uri !== decodeURI(uri);
	}
}