import * as https from 'https';
import { Subject } from 'rxjs';

export type Proxy = {
	IP: string;
	PORT: string;
	used: number;
	fails: number;
}

export class ProxyService {
	private downloadUrl = 'https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=650&country=all&ssl=yes&anonymity=elite';
	private map = new Map<string, Proxy>();
	private syncInterval = 20 * (60 * 1000); // 20 mins
	private lastSyncDate = null;
	private syncing = false;
	private subjs: Subject<Proxy>[] = [];

	constructor() {
		console.error('ProxyService CREATED!!!!!!!!!!!!!!!!');
		this.sync();
	}

	get() {
		this.handleSync();
		const subj = new Subject<Proxy>();
		if (this.syncing && !this.map.size) {
			this.subjs.push(subj);
			return subj;
		}
		setTimeout(() => {
			subj.next(this.getProxy());
			subj.complete();
		});
		return subj;
	}

	private getProxy(): Proxy {
		const proxies = Array.from(this.map)
			.map(d => {
				return d[1];
			})
			.filter(p => {
				return !p.fails;
			})
			.sort((a, b) => {
				return a.used - b.used;
			});

		let proxy = proxies[0];
		if (!proxies.length) {
			proxy = Array.from(this.map)[0][1];
		}
		proxy.used = proxy.used + 1;

		return proxy;
	}

	private recive() {
		this.subjs.forEach(s => {
			s.next(this.getProxy());
			s.complete();
		});
		this.subjs = [];
	}

	private handleSync() {
		if (!this.lastSyncDate) {
			return;
		}
		const offset = Date.now() - this.lastSyncDate;
		if (offset >= this.syncInterval) {
			this.sync();
		}
	}

	private sync() {
		this.syncing = true;
		this.lastSyncDate = Date.now();
		var request = https.get(this.downloadUrl, response => {
			var data = '';
			response.on('data', (chunk) => {
				data += chunk;
			});
			response.on('end', () => {
				this.fill(data.split(/\n|\r/).filter(a => !!a));
				this.syncing = false;
				this.recive();
			});
			request.setTimeout(12000, () => {
				request.abort();
				this.syncing = false;
				this.recive();
			});
		});
	}

	private fill(proxies: string[]) {
		proxies.forEach(p => {
			const ip = p.split(':')[0];
			const port = p.split(':')[1];
			let proxy = this.map.get(p);
			if (proxy) {
				return;
			}
			proxy = {
				IP: ip,
				PORT: port,
				used: 0,
				fails: 0
			}
			this.map.set(p, proxy);
		});

		Array.from(this.map)
			.map(i => i[1])
			.filter(p => p.fails)
			.forEach(p => {
				this.map.delete(p.IP + ':' + p.PORT)
			});
	}
}