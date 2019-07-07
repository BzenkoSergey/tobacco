import { Subject, from, merge, of } from 'rxjs';
const puppeteer = require('puppeteer-extra');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const pluginAnonymizeUa = require('puppeteer-extra-plugin-anonymize-ua');
const UserAgent = require('user-agents');

import { PipeInjector } from './../../core/pipe-injector.interface';
import { Messager } from './../../core/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { Store } from '../../core/services/store';

import { proxies } from './proxy';

const pluginStealthInst = pluginStealth();
pluginStealthInst.enabledEvasions.delete("chrome.runtime");
puppeteer.use(pluginStealthInst);
puppeteer.use(pluginAnonymizeUa());

export class PhantomJob implements Job {
	private options: any;
	private messager: Messager;
	private di: DI;
	private pipePath: string;

	private fake = () => {
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
			runtime: window.chrome.runtime
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
	}

	private ignoreResources = [
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
		'acdn.adnxs.com',

		'googletagmanager.com',
		'google-analytics.com',
		'www.gstatic.com',
		'chat.ria.com',
		'webpush.ria.com',
		'google.com',
		'facebook.net',
		'doubleclick.net',
		'g.doubleclick.net',
		'creativecdn.com',
		'googleadservices.com',
		'facebook.com',
		'fonts.googleapis.com',
		'googletagservices.com',
		'googlesyndication.com',
		'adservice.google.com.ua',
		'adservice.google.com',
		'dom.ria.com/v1/api/user/bellNotifications',
		'dom.ria.com/node/getPopupBreadcrubs/?advert_type_id'
	]

	constructor(options: any, injector: PipeInjector, messager: Messager) {
		this.options = options;
		this.messager = messager;
	}

	run(data: any, subj?: Subject<any>) {
		subj = subj || new Subject();

		const url = typeof data === 'string' ? data : (data.url || data.target);
		let uri = this.handleUrl(url);

		const proxy = this.getProxy();

		puppeteer
			.launch(this.getLaunchOptions(proxy))
			.then(async browser => {
				let browserContext: any;
				let page: any;
				let html: any;

				process.on('exit', (e) => {
					this.closeAll(page, browserContext, browser);
					subj.error(e);
				});

				try {
					browserContext = await browser.createIncognitoBrowserContext();
					page = await browserContext.newPage();
					await this.handlePage(page);

					console.warn(uri);

					await page.goto(uri, {
						waitUntil: this.options.waitUntil || (this.options.loadFull ? 'networkidle2' : 'domcontentloaded'),
						timeout: 0
					});

					if (this.options.clickBefore) {
						await this.timeout(2000);

						try {
							await page.$eval(this.options.clickBefore[0], e => {
								if (!e) {
									return;
								}
								e.click();
							});
							await this.timeout(5000);
						} catch (e) {
							await this.exit(page, browserContext, browser, subj, html, url, proxy, data);
							return;
						}
					}

					const initState = await page.evaluate(() => {
						// @ts-ignore
						return JSON.stringify(window.__INITIAL_STATE__);
					});
					if (this.options.addDelay) {
						await this.timeout(this.options.addDelay);
					}
					html = await page.content();
					html = html.replace('</body>', '<script id="parseSc">'+ initState +'<script></body>');
					debugger;
					await this.exit(page, browserContext, browser, subj, html, url, proxy, data);
				} catch(e) {
					this.printError(e, uri, proxy, html);
					await this.closeAll(page, browserContext, browser);
					this.run(data, subj);
				}
			})
			.catch(e => {
				subj.error(e);
			});

		return subj;
	}

	private async exit(page: any, browserContext: any, browser: any, subj: Subject<any>, html, url, proxy, data) {
		page.removeAllListeners(['request']);
		const d = this.genResponse(html, url, proxy, data);
		subj.next(d);
		subj.complete();
		return this.closeAll(page, browserContext, browser);
	}


	private async handlePage(page: any) {
		await page.setRequestInterception(true);
		await page._client.send('Network.clearBrowserCookies');
		await page._client.send('Network.clearBrowserCache');
		await page.setCacheEnabled(false);
		await page.evaluateOnNewDocument(this.fake);

		this.setInterceptor(page);
		if (this.options.disableJs) {
			await page.setJavaScriptEnabled(false);
		}

		return page.emulate({
			name: 'Desktop 1920x1080',
			userAgent: new UserAgent(/Chrome/).toString(),
			viewport: {
				width: 1220,
				height: 1080
			}
		});
	}

	private handleUrl(url: string) {
		const encoded = this.isEncoded(url);
		if (encoded) {
			url = decodeURI(url);
		}
		url = encodeURI(url);
		return url;
	}

	private getLaunchOptions(proxy?: string) {
		return {
			headless: true,
			args: this.options.clickBefore || this.options.useProxy ? [
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
		};
	}

	private printError(e: any, uri: string, proxy: string, html: string) {
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
	}

	private getProxy() {
		const store = this.di.get<Store>(this.pipePath, DIService.STORE);
		let proxyCount = store.get('proxyCount') || 0;

		proxyCount = proxyCount + 1;
		if (proxyCount > (proxies.length - 1)) {
			proxyCount = 0;
		}
		const proxy = proxies[proxyCount].IP + ':' + proxies[proxyCount].PORT;
		store.set('proxyCount', proxyCount);
		return proxy;
	}

	private setInterceptor(page: any) {
		page.on('request', request => {
			const resourceType = request.resourceType();
			const resourceUrl = request.url();

			if (this.ignoreResources.some(i => resourceUrl.includes(i))) {
				request.abort();
				return;
			}
			if (resourceType === 'stylesheet' || resourceType === 'font' || resourceType === 'image') {
				request.abort();
			} else {
				request.continue();
			}
		});
	}

	private genResponse(html: string, url: string, proxy: string, data: any) {
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
		return d;
	}

	private async closeAll(page: any, browserContext: any, browser: any) {
		if (page) {
			page.removeAllListeners(['request']);
			await page.close();
		}
		if (browserContext) {
			await browserContext.close();
		}
		return browser.close();
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

	private timeout(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}