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
		let timeout = 10;

		const store = this.di.get<Store>(this.pipePath, DIService.STORE);
		const page = store.get('PHANTOM_PAGE');
		return async(page)
			.pipe(
				mergeMap(page => {
					if (!page) {
						console.error('================');
						const subj = new Subject();

						phantom.create()
							.then(instance => {
								instance.createPage()
									.then(page => {
										page
											.on('onResourceRequested', function(requestData) {
												// console.info('Requesting', requestData.url);
											})
											.then(() => {
												store.set('PHANTOM_PAGE', page);
												subj.next(page);
												subj.complete();
											})
											.catch(e => subj.error(e));
										
									})
									.catch(e => subj.error(e));
							})
							.catch(e => subj.error(e));
						timeout = 500;
						return subj;
					}
					console.error('=USE EXISYSYS===============');
					return async<any>(page);
				}),
				mergeMap(page => {
					const subj = new Subject();
					page
						.open(url)
						.then(() => {
							setTimeout(() => {
								page
									.property('content')
									.then((html) => {
										// instance.exit()
										// 	.then(() => {
												subj.next({
													html: html,
													url: url
												});
												subj.complete();
											// })
											// .catch(e => subj.error(e));
									})
									.catch(e => subj.error(e));
							}, timeout);
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
}