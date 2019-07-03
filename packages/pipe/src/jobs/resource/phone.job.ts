import * as https from 'https';
import * as http from 'http';
import * as url from 'url';
import * as HttpsProxyAgent from 'https-proxy-agent';
import * as HttpProxyAgent from 'http-proxy-agent';

import { Subject } from 'rxjs';

import { async } from './../../async';
import { PipeInjector } from '../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { Store } from '../../core/services/store';

export class ResourcePhoneJob implements Job {
	private options: any;
	private di: DI;
	private pipePath: string;
	private proxies = [
		"77.120.137.143:8080",
		"5.58.78.214:49345",
		"5.58.167.58:30538",
		"5.58.11.215:43222",
		"37.57.129.4:4444",
		"77.120.163.23:41359",
		"5.58.85.32:49328",
		"5.58.156.61:48638",
		"93.79.148.217:57276",
		"91.196.123.91:53281",
		"46.201.225.210:40629",
		"46.151.255.104:53281",
		"188.0.96.49:37802",
		"195.182.22.92:49455",
		"195.200.64.8:48885",
		"193.110.78.15:61267",
		"195.230.115.241:8080",
		"92.249.122.108:61778",
		"91.142.174.224:49966",
		"31.202.35.218:47329",
		"178.93.26.49:23500",
		"178.210.147.238:53281",
		"212.66.34.240:39800",
		"77.120.137.9:55746",
		"93.77.115.167:61205",
		"178.151.205.154:52956",
		"78.26.172.44:60310",
		"93.78.176.254:56846",
		"46.201.225.7:50866",
		"46.63.104.139:8080",
		"77.120.137.9:55746",
		"93.77.115.167:61205",
		"178.151.205.154:52956",
		"78.26.172.44:60310",
		"46.201.225.7:50866",
		"46.63.104.139:8080",
		"94.74.95.145:53281",
		"109.87.45.248:39460",
		"178.54.209.120:58418",
		"176.118.49.54:53281",
		"178.150.84.139:37584",
		"93.76.218.162:60790",
		"46.201.243.145:47169",
		"93.171.27.99:53281",
		"109.167.113.9:60891",
		"176.98.75.229:54256",
		"178.210.130.82:41258",
		"195.225.49.131:58302",
		"195.138.73.54:59117",
		"195.211.228.164:36022",
		"188.191.31.135:41258",
		"176.108.104.84:45819",
		"46.35.233.176:8080",
		"193.93.78.242:32231",
		"195.69.221.198:38701",
		"130.255.137.53:45128",
		"195.138.93.34:3128",
		"77.121.160.9:55148",
		"77.93.42.134:40192",
		"93.79.107.152:53281",
	
		"94.130.126.94:8008",
		"109.200.227.53:53281",
		"95.134.195.78:50236",
		"92.52.186.123:55485",
		"213.159.248.165:50895",
		"93.175.203.124:59482",
		"93.77.121.45:37062",
		"178.150.245.245:56181",
		"91.226.5.245:31740",
		"94.244.191.219:3128",
		"77.222.131.11:50972",
		"178.150.66.141:51927",
		"154.41.2.154:13538",
		"178.93.11.12:44304",
		"46.98.129.137:53281",
		"46.151.145.4:53281",
		"178.136.194.161:40660",
		"91.202.240.208:51678",
		"37.53.88.131:44771",
		"5.58.167.211:39936",
		"93.170.117.152:41878",
		"134.249.167.184:53281",
		"31.129.253.30:40223",
		"195.24.154.3:51749",
		"178.93.15.189:54293",
		"194.9.26.223:4550",
		"194.28.89.94:37059",
		"213.110.122.220:56871",
		"185.160.60.36:33471",
		"176.98.75.120:40952",
		"109.87.40.23:41039",
		"46.151.83.231:443",
		"91.227.183.222:43736",
		"91.214.128.243:23500",
		"159.224.182.206:55552",
		"178.150.100.39:35216",
		"77.93.34.62:40859",
		"178.151.143.112:31260",
		"92.60.190.249:51981",
		"109.251.185.20:52340",
		"91.203.114.105:30653",
		"31.202.121.62:31070",
		"194.187.216.228:53281",
		"194.12.121.100:61600",
		"77.120.40.54:31324",
		"31.129.175.214:49947",
		"46.98.65.46:53281",
		"46.219.77.3:53361",
		"91.219.171.70:42458",
		"85.198.133.19:43157",
		"95.67.45.234:8080",
		"5.58.131.2:56121",
		"91.226.35.93:53281",
		"176.111.180.209:54237",
		"82.117.244.85:31280",
		"95.67.100.105:42675",
		"195.78.93.28:3128",
		"178.93.44.129:39559",
		"93.171.242.39:54051",
		"195.211.174.36:57734",
		"46.219.104.160:33652",
		"62.122.201.241:46176",
		"37.57.253.91:37186",
		"195.225.48.113:58302",
		"46.98.51.179:53281",
		"91.197.221.74:8888",
		"80.249.229.64:53063",
		"92.112.24.62:59311"
	];

	constructor(options: any, injector: PipeInjector, messager: Messager) {
		this.options = options;
	}

	run(data: any, subj?: Subject<any>, tryhttp = false) {
		return async(data);
		const store = this.di.get<Store>(this.pipePath, DIService.STORE);
	
		let obj = data.data;
		subj = subj || new Subject();

		let proxyCount = store.get('proxyCount2') || 0;
		proxyCount = proxyCount + 1;
		if (proxyCount > (this.proxies.length - 1)) {
			proxyCount = 0;
		}
		const proxy = this.proxies[proxyCount];
		store.set('proxyCount2', proxyCount);

		debugger;
		https.request({
			host: 'www.olx.ua',
			path: '/ajax/misc/contact/phone/' + obj.phone_id + '/?pt=' + obj.phone_token,
			// port: proxy.split(':')[1],
			method: 'GET',
			protocol: 'https:',
			agent: new HttpsProxyAgent({
				host: data.proxy.split(':')[0],
				port: +data.proxy.split(':')[1],
				secureProxy: true
			}),
			// secureProtocol: 'TLS_method',
			headers: {
				'authority': 'www.olx.ua',
				'method': 'GET',
				'scheme': 'https',
				'referer': obj.target,
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36'
			}
		}, (res: any) => {
			res.setEncoding('utf8');

			let err = false;
			res.on('data', (d) => {
				try {
					JSON.parse(d);
				} catch(e) {
					err = true;
				}
				debugger;
				console.log('RESSSSPONSEEEEEE');
				console.log(d);
			});
			res.on('end', () => {
				// if (!err) {
				// 	console.log('end');
					subj.next(data);
					subj.complete();
				// 	return;
				// }
				// this.run(data, subj, false);
			});
		})
		.on('error', (e: any) => {
			console.log(e);
			console.log(proxy);
			debugger;
			this.run(data, subj);
			//subj.error(e);
		})
		.end();

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