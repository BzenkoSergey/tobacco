// import { combineLatest, of, throwError } from 'rxjs'
// import { tap, mergeMap, catchError } from 'rxjs/operators';

// import { Pipe } from './pipe';
// import { PipeStatus} from './status.enum';
// import { Messager } from './messager.interface';
// import { PipeBase, ProcessBase } from './pipe.abstract';
// import { RecoveryOptions } from './recovery-options';

// interface PipeInfoItem {
// 	id: string;
// 	children: PipeInfoItem[];
// 	order?: string;
// }

// interface PipeItem {
// 	pipe: Pipe;
// 	children: PipeItem[];
// }

// interface Process extends ProcessBase {
// 	parentProcess: string,
// 	pipes: PipeInfoItem[]
// }

// export class PipeGroup extends PipeBase<Process> {
// 	private injected = new Map<any, any>();
// 	private messager: Messager;

// 	protected id: string;
// 	protected order = '0';
// 	protected process: Process;

// 	private recoveryOptions: RecoveryOptions;
// 	private restor = false;
// 	private pipesInfo: PipeInfoItem[] = [];
// 	private pipes: PipeItem[] = [];
// 	private parentProcessId: string;
// 	private resetPipes = false;
// 	private pipesOrder = 0;

// 	constructor(
// 		id: string,
// 		order: string,
// 		messager: Messager,
// 		parentProcessId: string,
// 		recoveryOptions: RecoveryOptions,
// 		restor: boolean
// 	) {
// 		super('pipes-group');
// 		this.messager = messager;
// 		this.id = id;
// 		this.parentProcessId = parentProcessId;
// 		this.recoveryOptions = recoveryOptions;
// 		this.restor = restor;
// 		this.order = order;
// 	}

// 	run(options?: any) {
// 		return this.fetch()
// 			.pipe(
// 				tap(d => {
// 					this.pipesInfo = d.pipes;
// 					this.processes = d.processes;
// 				}),
// 				mergeMap(() => {
// 					return this.defineProcess();
// 				}),
// 				tap(() => {
// 					this.messager('PROCESS_DEFINED', {
// 						info: {
// 							id: this.id,
// 							process: this.process,
// 							order: this.order
// 						}
// 					});
// 					if (this.restor) {
// 						const pipeGroupProcessId = this.recoveryOptions.pipeGroupProcessId;
// 						const pipeGroupId = this.recoveryOptions.pipeGroupId;
// 						if (!pipeGroupProcessId && pipeGroupId === this.id) {
// 							this.resetPipes = false;
// 						}
// 						if (pipeGroupProcessId && pipeGroupId === this.id) {
// 							this.resetPipes = pipeGroupProcessId === this.process.id;
// 							// console.log('resssssss', this.resetPipes);
// 						}
// 						// console.log(this.resetPipes, this.id, this.process.id, this.order);
// 					}
// 					this.pipes = this.createPipes(this.process.pipes);
// 				}),
// 				catchError(e => this.handleError(e)),
// 				mergeMap(() => {
// 					this.process.startDate = Date.now();
// 					this.process.status = PipeStatus.IN_PROCESS;
// 					return this.update();
// 				}),
// 				catchError(e => this.handleError(e)),
// 				mergeMap(() => {
// 					// console.log('Gruop start');
// 					return this.runPipes(options, this.pipes);
// 				}),
// 				catchError(e => this.handleError(e)),
// 				mergeMap(d => {
// 					this.process.endDate = Date.now();
// 					this.process.status = PipeStatus.DONE;
// 					// console.log('Gruop Done');
// 					return this.update()
// 						.pipe(
// 							mergeMap(() => of(d))
// 						);
// 				}),
// 				catchError(e => this.handleError(e))
// 			);
// 	}

// 	private defineProcess() {
// 		if (this.restor) {
// 			let pipeGroupProcessId = this.parentProcessId;
// 			// if (this.recoveryOptions && this.recoveryOptions.pipeGroupId === this.id) {
// 			// 	pipeGroupProcessId = this.recoveryOptions.pipeGroupProcessId || this.parentProcessId;
// 			// }
// 			return this.defineExistsProcess(pipeGroupProcessId);
// 		}

// 		console.log('========== GROUP NEW PROCESS');
// 		const process: Process = {
// 			...this.createProcess(),
// 			input: '',
// 			output: '',
// 			parentProcess: this.parentProcessId,
// 			pipes: JSON.parse(JSON.stringify(this.pipesInfo))
// 		};

// 		return this.saveProcess(process);
// 	}

// 	private handleMessage(code: string, info: any) {
// 		if (code === 'REPEAT_GROUP') {
// 			this.messager(code, {
// 				inst: this,
// 				info: info
// 			});
// 		}
// 	}

// 	private createPipes(pipes: PipeInfoItem[]) {
// 		const list: PipeItem[] = [];
// 		pipes.forEach(g => {
// 			const order = this.order.toString() + '_' + this.pipesOrder.toString();
// 			g.order = order;
// 			const pipe = new Pipe(
// 				g.id,
// 				order,
// 				(serviceClass: any) => {
// 					return this.resolveService(serviceClass);
// 				},
// 				(code: string, info: any) => {
// 					this.handleMessage(code, info);
// 				},
// 				this.parentProcessId,
// 				this.recoveryOptions,
// 				this.restor,
// 				this.resetPipes
// 			);

// 			this.pipesOrder = this.pipesOrder + 1;
// 			const children = this.createPipes(g.children);
// 			list.push({
// 				pipe: pipe,
// 				children: children
// 			});
// 		});
// 		return list;
// 	}
// 	protected handleError(e) {
// 		try {
// 			if (!this.process) {
// 				// const s = this.processes.filter(p => p.parentProcess === this.parentProcessId)
				
// 				// console.log(typeof this.order, this.recoveryOptions.pipeGroupProcessId);
// 				// console.log(this.id, this.order, this.parentProcessId, s);
// 				// console.log(this);
// 			}
// 			this.process.endDate = Date.now();
// 			this.process.status = PipeStatus.ERROR;
// 			this.process.error = e.toString();
	
// 			return this.update()
// 				.pipe(
// 					mergeMap(() => throwError(e))
// 				);
// 		} catch(e) {
// 			return throwError(e);
// 		}
// 	}

// 	private resolveService(serviceClass: any) {
// 		let inst = this.injected.get(serviceClass);
// 		if (!inst) {
// 			inst = new serviceClass();
// 			this.injected.set(serviceClass, inst);
// 		}
// 		return inst;
// 	}

// 	private runPipes(options: any, pipeItem: PipeItem[]) {
// 		const subjs = pipeItem.map(groupItem => {
// 			return this.runPipe(options, groupItem);
// 		});
// 		return combineLatest(...subjs);
// 	}

// 	private runPipe(options: any, pipeItem: PipeItem) {
// 		return pipeItem.pipe.run(options)
// 			.pipe(
// 				mergeMap(d => {
// 					if (!pipeItem.children.length) {
// 						return of(d);
// 					}
// 					return this.runPipes(d, pipeItem.children);
// 				})
// 			);
// 	}
// }