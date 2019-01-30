import { Subject, from, merge } from 'rxjs';
const phantom = require('phantom');

import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { Store } from './../../core/store';
import { async } from './../../async';
import { mergeMap } from 'rxjs/operators';

export class PhantomJob implements Job {
	private options: any;
	private messager: Messager;
	private di: DI;
	private pipePath: string;

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

	run(url: string) {
		// const subj = new Subject();
		console.log('====/////////' + this.options.timeout);
		let timeout = this.options.timeout || 2000;

		console.log(timeout, this.options);

		const store = this.di.get<Store>(this.pipePath, DIService.STORE);
		const page = store.get('PHANTOM_PAGE');
		return async(page)
			.pipe(
				mergeMap(page => {
					if (true) {
						console.error('================');
						const subj = new Subject();

						phantom.create()
							.then(instance => {
								instance.createPage()
									.then(page => {
										// page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36';
					
										page
											.on('onResourceRequested', function(requestData) {
												// console.info('Requesting', requestData.url);
											})
											.then(() => {
												store.set('PHANTOM_PAGE', page);
												subj.next([page, instance]);
												subj.complete();
											})
											.catch(e => subj.error(e));
										
									})
									.catch(e => subj.error(e));
							})
							.catch(e => subj.error(e));
						timeout = timeout + 1000;
						return subj;
					}
					console.error('=USE EXISYSYS===============');
					return async<any>(page);
				}),
				mergeMap(d => {
					const page = d[0];
					const instance = d[1];
					const encoded = this.isEncoded(url);
					let uri = url;
	
					if (encoded) {
						uri = decodeURI(uri);
					}
					uri = encodeURI(uri);

					console.log('======= run');
					console.log(uri);
	//				"modes": ["DB_BRANCHES2_SYNC_ON_DONE", "DB_2NO_SYNC"],
    
					const subj = new Subject();
					page
						.open(uri)
						.then(() => {
							setTimeout(() => {
								page
									.property('content')
									.then((html) => {
										instance.exit()
											.then(() => {
												// page.close();
												subj.next({
													html: html,
													url: url
												});
												subj.complete();
											})
											.catch(e => subj.error(e));
									})
									.catch(e => subj.error(e));
							}, timeout);
							console.log('============|||||: ' + timeout)
						})
						.catch(e => subj.error(e));
					return subj;
				})
			)

		// phantom.create()
		// 	.then(instance => {
		// 		instance.createPage()
		// 			.then(page => {
		// 				page
		// 					.on('onResourceRequested', function(requestData) {
		// 						// console.info('Requesting', requestData.url);
		// 					})
		// 					.then(() => {
		// 						page
		// 							.open(url)
		// 							.then(() => {
		// 								setTimeout(() => {
		// 									page
		// 										.property('content')
		// 										.then((html) => {
		// 											instance.exit()
		// 												.then(() => {
		// 													subj.next({
		// 														html: html,
		// 														url: url
		// 													});
		// 													subj.complete();
		// 												})
		// 												.catch(e => subj.error(e));
		// 										})
		// 										.catch(e => subj.error(e));
		// 								}, 1000);
		// 							})
		// 							.catch(e => subj.error(e));
		// 					})
		// 					.catch(e => subj.error(e));
						
		// 			})
		// 			.catch(e => subj.error(e));
		// 	})
		// 	.catch(e => subj.error(e));

		// return subj;
	}

	private isEncoded(uri: string) {
		uri = uri || '';
	  
		return uri !== decodeURI(uri);
	}
}