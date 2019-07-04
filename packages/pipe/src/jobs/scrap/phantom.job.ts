import { Subject, from, merge, of } from 'rxjs';
const phantom = require('phantom');
const puppeteer = require('puppeteer-extra');
var ProxyLists = require('proxy-lists');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const pluginAnonymizeUa = require('puppeteer-extra-plugin-anonymize-ua');
const UserAgent = require('user-agents');

import { PipeInjector } from './../../core/pipe-injector.interface';
import { Messager } from './../../core/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { Store } from '../../core/services/store';
import { async } from './../../async';
import { mergeMap } from 'rxjs/operators';

import { proxies } from './proxy';

export class PhantomJob implements Job {
	private options: any;
	private messager: Messager;
	private di: DI;
	private pipePath: string;
	private proxyOptions = {
		countries: ['ua,ru,by',
			'bj', // Benin
			'cy', //  Cyprus
			'ee', // Estonia
			'sz', // Eswatini
			'et', // Ethiopia
			'fe', // Finland
			'fr', // France
			'ge', // Georgia
			'de', // Germany
			'gr', // Greece
			'hk', // Hong Kong
			'il', // Israel
			'it', //  Italy
			'kz', // Kazakhstan
			'lv', // Latvia
			'lu', // Luxembourg
			'mn', // Mongolia
			'pl', // Poland
			'pt', // Portugal
			'rs', // Serbia
			'si', // Slovenia
			'es', // Spain
			'tj', // Tajikistan
			'tr', // Turkey
			'uz' // Uzbekistan
		],
		anonymityLevel: 'elite',
		sourcesBlackList: [
			'bitproxies',
			'kingproxies',
			'freeproxylist',
			'coolproxy',
			'blackhatworld',
			'sockslist',
			'new-net-time',
			'100-scrapebox-proxies',
			'gscraper-proxies',
			'proxydb',
			'proxy-list-org'
		]
		// sourcesWhiteList: ['premproxy']
	};
	private proxies = [
		'186.42.163.234:48600',
		'169.255.222.227:58194',
		'96.80.89.69:8080',
		'95.87.127.133:34521',
		'212.2.204.181:37626',
		'14.232.208.88:38204',
		'159.224.220.63:44299',
		'62.44.16.177:32067',
		'188.26.3.152:43571',
		'182.253.115.66:53826',

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
		"92.112.24.62:59311",
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
		"93.77.121.45:37062"
	];

	users = [
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
		'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9',
		'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36',
		'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Safari/537.36',
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
		'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
		'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31',
		'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
		'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',
		'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
		'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2)',
		'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)',
		'Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 YaBrowser/17.6.1.749 Yowser/2.5 Safari/537.36',
		'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 YaBrowser/17.3.1.840 Yowser/2.5 Safari/537.36',
		'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 YaBrowser/18.3.1.1232 Yowser/2.5 Safari/537.36',
		'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0',
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0',
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0',
		'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0',
		'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 OPR/43.0.2442.991',
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36 OPR/56.0.3051.52',
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99'
	].sort(function() {
		return .5 - Math.random();
	  });

	constructor(options: any, injector: PipeInjector, messager: Messager) {
		this.options = options;
		// this.di = injector;
		// this.httpStack = injector(HttpStack);
		this.messager = messager;
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


	run(data: any, subj?: Subject<any>) {
		const store = this.di.get<Store>(this.pipePath, DIService.STORE);

		const url = typeof data === 'string' ? data : (data.url || data.target);
		const encoded = this.isEncoded(url);
		let uri = url;

		if (encoded) {
			uri = decodeURI(uri);
		}
		uri = encodeURI(uri);

		subj = subj || new Subject();

		let proxyCount = store.get('proxyCount') || 0;

		proxyCount = proxyCount + 1;
		if (proxyCount > (proxies.length - 1)) {
			proxyCount = 0;
		}
		const proxy = proxies[proxyCount].IP + ':' + proxies[proxyCount].PORT;
		store.set('proxyCount', proxyCount);

		if (this.options.clickBefore) {
			// console.warn('=======================================');
			// console.warn(`--proxy-server=${proxy}`);
			// console.warn(uri);
			// console.warn('=======================================');
		}
		const d1 = Date.now();


		let ag = store.get('userAgent') || 0;
		ag = ag + 1;
		if (ag >= this.users.length - 1) {
			ag = 0;
		}
		store.set('userAgent', ag);
		

		const f = pluginStealth();
		f.enabledEvasions.delete("chrome.runtime")
		puppeteer.use(f);
		puppeteer.use(pluginAnonymizeUa());
		puppeteer
			.launch({
				headless: true,
				args: this.options.clickBefore ? [
					`--proxy-server=${proxy}`,
					'--incognito',
					'--disk-cache-size=0',
					'--disable-webgl',
					'--ignore-certifcate-errors',
					'--ignore-certifcate-errors-spki-list',
				] : [
					'--incognito',
					'--disk-cache-size=0',
					'--disable-webgl'
				]
				// ,
				// executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
			})
			.then(async browser => {
				if (this.options.clickBefore) {
					console.warn('puppeteer.launch', Date.now() - d1);
				}
				let browserContext: any;
				let page: any;
				let html: any;
				try {
					browserContext = await browser.createIncognitoBrowserContext();
					if (this.options.clickBefore) {
						console.warn('browser.createIncognitoBrowserContext', Date.now() - d1);
					}
					// const pageip = await browserContext.newPage();
					// await pageip.goto('https://www.myip.com/');
					// const sc = await pageip.screenshot({encoding: 'base64'});

					// console.log('%c ', 'font-size:2000px; background-image:url(data:image/jpg;base64,'+ sc +');');
					// await pageip.close();

					page = await browserContext.newPage();
					if (this.options.clickBefore) {
						console.warn('browserContext.newPage', Date.now() - d1);
					}
					await page.setRequestInterception(true);
					await page._client.send('Network.clearBrowserCookies');
					await page._client.send('Network.clearBrowserCache');
					await page.setCacheEnabled(false);

					await page.emulate({
						name: 'Desktop 1920x1080',
						userAgent: new UserAgent(/Chrome/).toString() || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36' || this.users[ag],
						viewport: {
							width: 1220,
							height: 1080
						}
					});
					if (this.options.clickBefore) {
						console.warn('page.emulate', Date.now() - d1);
					}
					page.on('request', request => {
						const resourceType = request.resourceType();
						const resourceUrl = request.url();

						// https://static-olxeu.akamaized.net/static/olxua/packed/sw11becdb354109d4d2eb9eb7d9b2e7627.js
						const ignore = [
							'connect.facebook.net',
							'facebook.com',
							'stats.g.doubleclick.net',
							'cdn.optimizely.com',
							'sdk.privacy-center.org',
							'googletagservices.com',
							'bidder.criteo.com',
							'google.com',
							// 'pixel',
							'.css',
							'prebid-eu.creativecdn.com',
							'static.criteo.net',
							'ninja.akamaized.net',
							'ssl.google-analytics.com',
							'gde-default.hit.gemius.p',
							'ib.adnxs.com',
							'prg.smartadserver.com',
							'inv-nets.admixer.net',
							// 'www.olx.ua/akam',
							'secure.adnxs.com',
							'acdn.adnxs.com'
						];
						if (resourceUrl.includes('pixel_')) {
							console.log(request);
							debugger;
						}
						if (ignore.some(i => resourceUrl.includes(i))) {
							request.abort();
							return;
						}
						if (resourceType === 'stylesheet' || resourceType === 'font' || resourceType === 'image') {
							request.abort();
						} else {
							if (this.options.clickBefore) {
								// console.warn(resourceType, resourceUrl);
							}
							request.continue();
						}
					});
					page.on('response', response => {
						const pattern = 'ajax/misc/contact/phone';
						if (response.url().includes(pattern)) {
							response.text().then(d => {
								console.error('=======================================');
								console.error('=======================================');
								console.error(proxy);
								console.error(response.url());
								console.error(response.headers());
								console.error(d);
								console.error('=======================================');
								console.error('=======================================');
							});
						}
					});

					// domcontentloaded
					// networkidle2
					if (this.options.clickBefore) {
						console.warn('before page.goto', Date.now() - d1);
					}

					await page.evaluateOnNewDocument(() => {
						// @ts-ignore
						window.chrome = {
							app: {
								"isInstalled":false,
								InstallState: {DISABLED: "disabled", INSTALLED: "installed", NOT_INSTALLED: "not_installed"},
								RunningState: {CANNOT_RUN: "cannot_run", READY_TO_RUN: "ready_to_run", RUNNING: "running"}
							},
							csi: () => {},
							loadTimes: () => {},
							runtime: {
								OnInstalledReason: {
									INSTALL: 'install',
									UPDATE: 'update',
									CHROME_UPDATE: 'chrome_update',
									SHARED_MODULE_UPDATE: 'shared_module_update'
								},
								OnRestartRequiredReason: {
									APP_UPDATE: 'app_update',
									OS_UPDATE: 'os_update',
									PERIODIC: 'periodic'
								},
								PlatformArch: {
									ARM: 'arm',
									X86_32: 'x86-32',
									X86_64: 'x86-64'
								},
								PlatformNaclArch: {
									ARM: 'arm',
									X86_32: 'x86-32',
									X86_64: 'x86-64'
								},
								PlatformOs: {
									MAC: 'mac',
									WIN: 'win',
									ANDROID: 'android',
									CROS: 'cros',
									LINUX: 'linux',
									OPENBSD: 'openbsd'
								},
								RequestUpdateCheckStatus: {
									THROTTLED: 'throttled',
									NO_UPDATE: 'no_update',
									UPDATE_AVAILABLE: 'update_available'
								},
								connect: () => {},
								id: undefined,
								sendMessage: () => {}
							}
						};
						// @ts-ignore
						window.navigator.chrome = {
							// @ts-ignore
							runtime: {
								OnInstalledReason: {
									INSTALL: 'install',
									UPDATE: 'update',
									CHROME_UPDATE: 'chrome_update',
									SHARED_MODULE_UPDATE: 'shared_module_update'
								},
								OnRestartRequiredReason: {
									APP_UPDATE: 'app_update',
									OS_UPDATE: 'os_update',
									PERIODIC: 'periodic'
								},
								PlatformArch: {
									ARM: 'arm',
									X86_32: 'x86-32',
									X86_64: 'x86-64'
								},
								PlatformNaclArch: {
									ARM: 'arm',
									X86_32: 'x86-32',
									X86_64: 'x86-64'
								},
								PlatformOs: {
									MAC: 'mac',
									WIN: 'win',
									ANDROID: 'android',
									CROS: 'cros',
									LINUX: 'linux',
									OPENBSD: 'openbsd'
								},
								RequestUpdateCheckStatus: {
									THROTTLED: 'throttled',
									NO_UPDATE: 'no_update',
									UPDATE_AVAILABLE: 'update_available'
								},
								connect: () => {},
								id: undefined,
								sendMessage: () => {}
							}
							// etc.
						};

						Object.defineProperty(navigator, "languages", {
							get: function() {
								return ["en-US", "en"];
							}
						});
						
						Object.defineProperty(navigator, 'plugins', {
							get: function() {
								return [
									"Chrome PDF Plugin",
									"Chrome PDF Viewer",
									"Native Client"
								];
							}
						});
						Object.defineProperty(navigator, 'webdriver', { get: () => false });
						// @ts-ignore
						navigator.maxTouchPoints = 0;

						// @ts-ignore
						const originalQuery = window.navigator.permissions.query;
						// @ts-ignore
						window.navigator.permissions.query = (parameters) => {
							if (parameters.name === 'notifications') {
								// @ts-ignore
								return Promise.resolve({ state: Notification.permission })
							}
							return originalQuery(parameters);
						};
					});
					await page.goto(uri, { waitUntil: 'domcontentloaded', timeout: 0 });
					if (this.options.clickBefore) {
						console.warn('page.goto', Date.now() - d1);
					}
					// await page.evaluate(() => {
						// localStorage.clear();
						// sessionStorage.clear();
					// });
					// await page._client.send("Network.clearBrowserCookies");

					const f4 = await page.evaluate(() => {
						// @ts-ignore
						return JSON.stringify(window.chrome);
					});
					debugger;
					const cookies = await page.cookies();
					if (this.options.clickBefore) {
						console.error('===========cookies');
						console.error(cookies);
						console.error('//===========cookies');
					}
					if (this.options.clickBefore) {
						console.warn('page.evaluate', Date.now() - d1);
					}

					if (this.options.clickBefore) {
						await this.timeout(2000);
				
						html = await page.content();
						debugger;
						try {
							await page.$eval(this.options.clickBefore[0], e => {
								if (!e) {
									return;
								}
								e.click();
							});
							console.warn('page.$eval', Date.now() - d1);
						} catch (e) {
							const res = {
								html: html,
								url: url
							}
							let d = {
								...res
							}
							if (typeof data !== 'string') {
								d = {
									...d,
									...data
								}
							}
							subj.next(d);
							subj.complete();
							return;
						}

						await this.timeout(5000);
						debugger;
						// console.warn('=======================================');
						// console.warn('=======================================');
						// console.warn('=======================================');
						// console.warn('=======================================');
						// console.warn('=======================================');
						// console.warn(`--proxy-server=${proxy}`);
						// console.warn(uri);
						// console.warn('=======================================');
						// console.warn('=======================================');
						// console.warn('=======================================');
						// console.warn('=======================================');
						// console.warn('=======================================');
						html = await page.content();
						console.warn('page.content', Date.now() - d1);

						page.removeAllListeners(['request', 'response']);
						await page.close();
						console.warn('page.close', Date.now() - d1);
						await browserContext.close();
						console.warn('browserContext.close', Date.now() - d1);
						await browser.close();
						console.warn('browser.close(', Date.now() - d1);
						const res = {
							html: html,
							url: url
						}
						let d = {
							...res
						}
						if (typeof data !== 'string') {
							d = {
								...d,
								...data
							}
						}
						subj.next(d);
						subj.complete();
						return;
					}

					html = await page.content();

					page.removeAllListeners(['request', 'response']);
					await page.close();
					await browserContext.close();
					await browser.close();
					const res = {
						html: html,
						url: url,
						proxy: proxy
					}
					let d = {
						...res
					}
					if (typeof data !== 'string') {
						d = {
							...d,
							...data
						}
					}
					subj.next(d);
					subj.complete();
				} catch(e) {
					console.error('////////////////////////////////');
					console.error('////////////////////////////////');
					console.error('////////////////////////////////');
					console.error('////////////////////////////////');
					console.error(e);
					console.error(uri);
					console.error(proxy);
					console.error(html);
					console.error('////////////////////////////////');
					console.error('////////////////////////////////');
					console.error('////////////////////////////////');
					if (page) {
						page.removeAllListeners(['request', 'response']);
						await page.close();
					}
					if (browserContext) {
						await browserContext.close();
					}
					await browser.close();
					this.run(data, subj);
				}
			})
			.catch(e => subj.error(e));

		return subj;
	}

	// run(url: string) {
	// 	// const subj = new Subject();
	// 	let timeout = this.options.timeout || 2000;

	// 	const store = this.di.get<Store>(this.pipePath, DIService.STORE);
	// 	const page = store.get('PHANTOM_PAGE');
	// 	return async(page)
	// 		.pipe(
	// 			mergeMap(page => {
	// 				if (true) {
	// 					const subj = new Subject();

	// 					phantom.create()
	// 						.then(instance => {
	// 							instance.createPage()
	// 								.then(page => {
	// 									// page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36';
			
	// 									page
	// 										.on('onResourceRequested', function(requestData, request) {
	// 											console.info('Requesting', requestData.url);
	// 										})
	// 										.then(() => {
	// 											store.set('PHANTOM_PAGE', page);
	// 											subj.next([page, instance]);
	// 											subj.complete();
	// 										})
	// 										.catch(e => subj.error(e));
										
	// 								})
	// 								.catch(e => subj.error(e));
	// 						})
	// 						.catch(e => subj.error(e));
	// 					timeout = timeout + 1000;
	// 					return subj;
	// 				}
	// 				return async<any>(page);
	// 			}),
	// 			mergeMap(d => {
	// 				const page = d[0];
	// 				const instance = d[1];
	// 				const encoded = this.isEncoded(url);
	// 				let uri = url;
	
	// 				if (encoded) {
	// 					uri = decodeURI(uri);
	// 				}
	// 				uri = encodeURI(uri);

	// //				"modes": ["DB_BRANCHES2_SYNC_ON_DONE", "DB_2NO_SYNC"],
    
	// 				const subj = new Subject();
	// 				page
	// 					.open(uri)
	// 					.then(() => {
	// 						setTimeout(() => {
	// 							page
	// 								.property('content')
	// 								.then((html) => {
	// 									instance.exit()
	// 										.then(() => {
	// 											// page.close();
	// 											subj.next({
	// 												html: html,
	// 												url: url
	// 											});
	// 											subj.complete();
	// 										})
	// 										.catch(e => subj.error(e));
	// 								})
	// 								.catch(e => subj.error(e));
	// 						}, timeout);
	// 					})
	// 					.catch(e => subj.error(e));
	// 				return subj;
	// 			})
	// 		)

	// 	// phantom.create()
	// 	// 	.then(instance => {
	// 	// 		instance.createPage()
	// 	// 			.then(page => {
	// 	// 				page
	// 	// 					.on('onResourceRequested', function(requestData) {
	// 	// 						// console.info('Requesting', requestData.url);
	// 	// 					})
	// 	// 					.then(() => {
	// 	// 						page
	// 	// 							.open(url)
	// 	// 							.then(() => {
	// 	// 								setTimeout(() => {
	// 	// 									page
	// 	// 										.property('content')
	// 	// 										.then((html) => {
	// 	// 											instance.exit()
	// 	// 												.then(() => {
	// 	// 													subj.next({
	// 	// 														html: html,
	// 	// 														url: url
	// 	// 													});
	// 	// 													subj.complete();
	// 	// 												})
	// 	// 												.catch(e => subj.error(e));
	// 	// 										})
	// 	// 										.catch(e => subj.error(e));
	// 	// 								}, 1000);
	// 	// 							})
	// 	// 							.catch(e => subj.error(e));
	// 	// 					})
	// 	// 					.catch(e => subj.error(e));
						
	// 	// 			})
	// 	// 			.catch(e => subj.error(e));
	// 	// 	})
	// 	// 	.catch(e => subj.error(e));

	// 	// return subj;
	// }

	private isEncoded(uri: string) {
		uri = uri || '';
	  
		return uri !== decodeURI(uri);
	}

	private timeout(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}