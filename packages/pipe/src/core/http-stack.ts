import * as https from 'https';
import * as http from 'http';
import * as url from 'url';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

export class HttpStack {
	private stackHistory = 0;
	private resolved = 0;
	private stack: any[] = [];
	private waitCount = 0;
	private runLimit = 3;

	constructor(private host: string, private allowHttpRedirect: boolean) {
		// console.log('==================================');
		// console.log('HTTP CONST');
		// console.log('==================================');
	}

	getStacksHistory() {
		return this.stackHistory;
	}

	get(url: string, data: any, end: any, error: any, httpType: string, agent = false, reTrayCount?: number) {
		const fn = this.make(url, data, end, error, httpType, agent, reTrayCount);
		this.stack.push(fn);
		++this.stackHistory;
		if(this.stack.length === 1) {
			this.runNext();
		}
	}

	private runNext() {
		if(this.waitCount >= this.runLimit) {
			return;
		}
		let next = this.stack[0];
		if(!next) {
			return;
		}

		next();
		this.runNext();
	}

	private isEncoded(uri: string) {
		uri = uri || '';
	  
		return uri !== decodeURI(uri);
	}

	private make(urlResource: string, data: any, end: any, error: any, httpType: string, withAgent: boolean, reTrayCount?: number): Function {
		return () => {
			this.stack.splice(0, 1);
			++this.waitCount;

			let agent: boolean|http.Agent = false;
			if(withAgent) {
				agent = new http.Agent({
					keepAlive: true,
					keepAliveMsecs: 10000,
					maxFreeSockets: 10000
				});
			}

			// console.log('//////////////////');
			// console.log(urlResource, httpType);
			try {
				const urlInfo = url.parse(urlResource);
				let method: any = (urlInfo.protocol === 'https:')? https : http;
				const encoded = this.isEncoded(urlInfo.path);
				let uri = urlInfo.path;

				if (encoded) {
					uri = decodeURI(uri);
				}
				uri = encodeURI(uri);

				// console.log(urlInfo.hostname);
				// console.log(encoded);
				// console.log(uri);
				// console.log(urlInfo.protocol);

				method.get({
					hostname: urlInfo.hostname,
					path: uri,
					protocol: urlInfo.protocol,
					agent: agent,
				}, (res: any) => {
					res.setEncoding('utf8');
					
					let html = '';
					res.on('data', data);
					res.on('end', () => {
						--this.waitCount;
						++this.resolved;
						this.runNext();
						if(this.allowHttpRedirect && res.headers.location && !!~res.headers.location.indexOf(this.host)) {
							this.get(res.headers.location, data, end, error, httpType, withAgent);
							return;
						}
						end(res.headers);
					});
				})
				.on('error', (e: any) => {
					--this.waitCount;

					if(e.code === 'ECONNRESET' || e.code === 'ETIMEDOUT') {
						console.error(e);
						console.error(urlResource);
						if (!reTrayCount) {
							setTimeout(() => {
								this.get(urlResource, data, end, error, httpType, true, (reTrayCount || 0) + 1);
							}, 300);
						}
						return;
					}
					error(e);
				});
			} catch(e) {
				error(e);
			}
		};
	}
}