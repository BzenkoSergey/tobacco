import * as https from 'https';
import * as http from 'http';
import * as url from 'url';

import { Subject } from 'rxjs';

import { PipeInjector } from '../core/pipe-injector.interface';
import { Messager } from '../core/messager.interface';
import { Job } from './job.interface';
import { DI } from './../core/di';

export class RequestJob implements Job {
	private options: any;

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
		const toSend = JSON.stringify(obj);
		const subj = new Subject();

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
				console.log(d);
			});
			res.on('end', () => {
				subj.next();
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
		return this;
	}

	setPipePath(path: string) {
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