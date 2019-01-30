import { Observable, Subscription, Subject, zip, combineLatest } from 'rxjs';
import { tap, mergeMap, catchError, delay, map } from 'rxjs/operators';

import { async } from './../async';
import { PipeStatus } from './pipe-status.enum';
import { PipeInput } from './pipe-input.interface';
import { PipeDb } from './pipe-db';
import { Queue } from './queue';
import { PipeMode } from './pipe-mode.enum';

export class Pipe extends PipeDb {
	private stream: Subject<any>;
	private streams: Observable<any>[] = [];
	private subscribtion = new Subscription();
	private childrenOutputs: any[] = [];
	protected children: Pipe[];

	private queue: Queue;
	private delay = 0; /// for visualization
	private optionsData: any;

	constructor(d: PipeInput, isolated = false) {
		super(d, isolated);
	}

	protected defineProperties(d: PipeInput, skipChildren = false) {
		super.defineProperties(d);

		if (!skipChildren) {
			this.children = this.createEntities(d.children);
		}
	}

	// init(processInput: PipeInput) {
	// 	this.processPipeId = processInput._id;

	// 	return async<PipeInput>(processInput)
	// 		.pipe(
	// 			tap(pipe => {
	// 				this.defineProperties(pipe, true);
	// 			}),
	// 			mergeMap(() => {
	// 				if (!processInput.children.length) {
	// 					return async();
	// 				}
	// 				this.children = processInput.children.map(c => {
	// 					return new Pipe(null, this.isolated)
	// 						.setDI(this.di);
	// 				});
	// 				const subjs = this.children.map((c, i) => {
	// 					return c.init(processInput.children[i]);
	// 				});
	// 				return combineLatest(...subjs);
	// 			})
	// 		);
	// }

	run(input: any) {
		const config = this.getConfig();
		if (!!~config.modes.indexOf(PipeMode.SCHEME_TO_CLONE)) {
			return async(input);
		}
		if (!!~config.modes.indexOf(PipeMode.RUN_ONCE) && this.process.status !== PipeStatus.PENDING) {
			return async(input);
		}
		this.endSynced = false;
		this.subscribtion.unsubscribe();
		this.subscribtion = new Subscription();
		this.stream = new Subject();
		this.streams = [];
		if (this.queue) {
			this.queue.destroy();
			this.queue = new Queue(this.getLimit());
		}
		this.childrenOutputs = [];

		if(!this.canRun()) {
			return async()
				.pipe(
					tap(() => {
						this.prepare();
					}),
					delay(this.delay),
					mergeMap(() => {
						if(this.runAsBranch()) {
							this.process.startDate = Date.now();
							this.process.status = PipeStatus.SKIPPED_JOB;
							return this.update(['startDate', 'status', 'createdTime']);
						}
						return async();
					}),
					delay(this.delay),
					catchError(e => this.handleError(e)),
					mergeMap(() => {
						return this.getOptions()
							.pipe(
								tap(d => this.optionsData = d)
							)
					}),
					catchError(e => this.handleError(e)),
					mergeMap(() => {
						const obs = this.getProcessOutput()
							.pipe(
								mergeMap(d => {
									if (d === '$stop') {
										return async(d);
									}
									if (d === '$skip') {
										return async(null);
									}
									return this.performChildren(d);
								})
							);
						this.addToStream(obs);
						return this.stream;
					}),
					delay(this.delay),
					catchError(e => this.handleError(e)),
					delay(this.delay),
					mergeMap(d => {
						if(this.runAsBranch()) {
							this.process.endDate = Date.now();
							this.process.status = PipeStatus.DONE;
							return this.update(['endDate', 'status'])
								.pipe(
									mergeMap(() => async(d))
								);
						}
						return async();
					}),
					catchError(e => this.handleError(e))
				);
		}

		return async()
			.pipe(
				tap(() => {
					this.prepare();
				}),
				delay(this.delay),
				mergeMap(() => {
					this.process.startDate = Date.now();
					this.process.status = PipeStatus.IN_PROCESS;
					return this.update(['startDate', 'status', 'createdTime']);
				}),
				delay(this.delay),
				catchError(e => this.handleError(e)),
				mergeMap(() => {
					if (this.input) {
						return async(this.input);
					}
					if (input) {
						return async(input);
					}
					if (this.process.input) {
						return this.getProcessInput();
					}
					return async(null);
				}),
				mergeMap(input => {
					return this.getOptions()
						.pipe(
							tap(d => this.optionsData = d),
							map(() => input)
						)
				}),
				catchError(e => this.handleError(e)),
				mergeMap(input => {
					const obs = this.perform(input);
					this.addToStream(obs);
					return this.stream;
				}),
				catchError(e => this.handleError(e)),
				delay(this.delay),
				mergeMap(d => {
					this.process.endDate = Date.now();
					this.process.status = PipeStatus.DONE;
					return this.update(['endDate', 'status'])
						.pipe(
							mergeMap(() => {
								return async(d);
							})
						);
				}),
				catchError(e => this.handleError(e))
			);
	}

	cloneChild(childPath: string, input: any, run = true) {
		const child = this.children.find(c => c.path === childPath);
		const scheme = child.getScheme();
		scheme.input = input;

		this.defineMeta(scheme, this.path, this.children.length);

		const inst = this.createEntities([scheme])[0];
		// debugger;
		// console.error('clone child');
		// console.error(inst.path);
		inst.setSchemeProcessId(this.schemeProcessId);
		inst.setDI(this.di);
		this.children.push(inst);

		const config = inst.getConfig();
		config.modes = config.modes.filter(i => i !== PipeMode.SCHEME_TO_CLONE);
		inst.setConfig(config);

		const subj = new Subject<any>();
		inst.sync()
			.subscribe(
				d => {
					subj.next(d)
				},
				e => subj.error(e),
				() => {
					subj.complete()
				}
			);

		this.addToStream(subj.pipe(
			mergeMap(() => {
				if (run) {
					return this.performChild(inst, input);
				} else {
					return async(null);
				}
			})
		));
		return subj;
	}

	private perform(input: any) {
		return (this.saveProcessInput(input) as Observable<any>)
			.pipe(
				mergeMap(() => {
					if (!this.canRun()) {
						return this.getProcessOutput();
					} else {
						if (this.jobInstance) {
							this.jobInstance.destroy();
							return this.jobInstance.run(input);
						}

						this.jobInstance = new this.job(this.optionsData || {})
							.setDI(this.di)
							.setSchemeId(this.schemeId)
							.setPipePath(this.path);
						
						return this.jobInstance.run(input);
					}
				}),
				mergeMap(d => {
					if (d === '$stop') {
						return async(d);
					}
					if (typeof d === 'object' && d !== null && d.status === '$release') {
						if (this.optionsData && this.optionsData.skipOutput) {
							this.performChildren(d.output).subscribe();
						}
						(this.saveProcessOutput(d.output) as Observable<any>)
							.pipe(
								mergeMap(() => {
									return this.performChildren(d.output);
								})
							).subscribe();
						this.stream.next(d.output);
						this.stream.complete();
						return async(d.output);
					}
					if (this.optionsData && this.optionsData.skipOutput) {
						return this.performChildren(d)
							.pipe(
								map((r) => r)
							);
					}
					return (this.saveProcessOutput(d) as Observable<any>)
						.pipe(
							mergeMap(() => {
								return this.performChildren(d)
									.pipe(
										map((r) => r)
									);
							})
						);
				})
			);
	}

	private performChildren(input: any) {
		if (!this.children.length) {
			return async(input);
		}
		const objs = this.children
			.map(c => {
				return this.performChild(c, input);
			});
		if (objs.length === 1) {
			return objs[0]; 
		}
		return zip(...objs);
	}

	private performChild(child: Pipe, input: any): Observable<any> {
		const fn = () => {
			return child
				.setSchemeProcessId(this.schemeProcessId)
				.setRunParts(this.runPaths)
				.setDI(this.di)
				.run(input);
		};
		if (!this.queue) {
			this.queue = new Queue(this.getLimit());
		}
		return this.queue.run(fn);
	}

	private createEntities(entities: PipeInput[]) {
		return entities.map(e => {
			return new Pipe(e, this.isolated)
				.setParentPipe(this);
		});
	}

	private addToStream(obs: Observable<any>) {
		this.streams.push(obs);
		const sub = obs.subscribe(
			d => {
				this.childrenOutputs.push(d);
			},
			e => {
				this.stream.error(e);
			},
			() => {
				this.streams.splice(0, 1);
				if (!this.streams.length) {
					if(this.childrenOutputs.length < 2) {
						this.stream.next(this.childrenOutputs[0]);
					} else {
						this.stream.next(this.childrenOutputs);
					}
					this.stream.complete();
					this.subscribtion.unsubscribe();
				}
			}
		);
		this.subscribtion.add(sub);
	}
}