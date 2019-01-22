import { Subject, from } from 'rxjs';
const phantom = require('phantom');

import { PipeInjector } from './../../pipes/pipe-injector.interface';
import { Messager } from './../../pipes/messager.interface';
import { Job } from './../job.interface';
import { DI } from './../../core/di';

export class PhantomJob implements Job {
	private options: any;
	private messager: Messager;
	private di: DI;
	private pipePath: string;

	constructor(options: any, injector: PipeInjector, messager: Messager) {
		this.options = options;
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
								page
									.open(url)
									.then(() => {
										setTimeout(() => {
											page
												.property('content')
												.then((html) => {
													instance.exit()
														.then(() => {
															subj.next({
																html: html,
																url: url
															});
															subj.complete();
														})
														.catch(e => subj.error(e));
												})
												.catch(e => subj.error(e));
										}, 4000);
									})
									.catch(e => subj.error(e));
							})
							.catch(e => subj.error(e));
						
					})
					.catch(e => subj.error(e));
			})
			.catch(e => subj.error(e));

		return subj;
	}
}