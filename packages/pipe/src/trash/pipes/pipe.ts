// import { of } from 'rxjs';
// import { tap, mergeMap, catchError } from 'rxjs/operators';

// import { JobRegister } from './../job-register';
// import { JobConstructor } from './../jobs/job.interface';

// import { PipeInjector } from './pipe-injector.interface';
// import { PipeStatus } from './status.enum';
// import { Messager } from './messager.interface';
// import { PipeBase, ProcessBase } from './pipe.abstract';
// import { RecoveryOptions } from './recovery-options';

// interface Process extends ProcessBase {
// 	result: string,
// 	parentProcess: string
// }

// export class Pipe extends PipeBase<Process> {
// 	private messager: Messager;
// 	private recoveryOptions: RecoveryOptions;
// 	private restor = false;
// 	private job: JobConstructor;
// 	private jobName: JobRegister;
// 	private injector: PipeInjector;
// 	private resetResult = false;
// 	private parentProcessId: string;

// 	protected id: string;
// 	protected order = '0';
// 	protected process: Process;

// 	constructor(
// 		id: string,
// 		order: string,
// 		injector: PipeInjector,
// 		messager: Messager,
// 		parentProcessId: string,
// 		recoveryOptions: RecoveryOptions,
// 		restor: boolean,
// 		resetResult: boolean
// 	) {
// 		super('pipes');
// 		this.messager = messager;
// 		this.injector = injector;
// 		this.id = id;
// 		this.order = order;
// 		this.parentProcessId = parentProcessId;
// 		this.recoveryOptions = recoveryOptions;
// 		this.restor = restor;

// 		this.resetResult = resetResult;
// 	}

// 	run(options: any) {
// 		return this.fetch()
// 			.pipe(
// 				tap(d => {
// 					this.jobName = d.jobName;
// 					this.processes = d.processes;
// 				}),
// 				mergeMap(() => {
// 					return this.defineProcess();
// 				}),
// 				tap(() => {
// 					this.job = JobRegister.getJob(this.jobName);
// 				}),
// 				catchError(e => this.handleError(e)),
// 				mergeMap(() => {
// 					this.process.startDate = Date.now();
// 					this.process.status = PipeStatus.IN_PROCESS;
// 					return this.update();
// 				}),
// 				catchError(e => this.handleError(e)),
// 				mergeMap(() => {
// 					if (this.restor) {
// 						const pipeProcessId = this.recoveryOptions.pipeProcessId;
// 						const allowMock = !pipeProcessId || +pipeProcessId <= +this.process.createdTime;
// 						// console.log(this.resetResult, this.jobName);
// 						// console.log(allowMock, this.resetResult);
// 						if (!this.resetResult && allowMock) {
// 							return new this
// 								.job(options, this.injector, this.messager)
// 								.run(this.process.result);
// 						}
// 					}
// 					return new this.job(options, this.injector, this.messager).run();
// 				}),
// 				catchError(e => this.handleError(e)),
// 				mergeMap(d => {
// 					this.process.endDate = Date.now();
// 					this.process.status = PipeStatus.DONE;
// 					this.process.result = d;

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
// 			const pipeProcessId = this.recoveryOptions.pipeProcessId || this.parentProcessId;
// 			return this.defineExistsProcess(pipeProcessId);
// 		}
// 		console.log('new');
// 		const process: Process = {
// 			...this.createProcess(),
// 			parentProcess: this.parentProcessId,
// 			result: '',
// 			input: '',
// 			output: ''
// 		};
// 		return this.saveProcess(process);
// 	}
// }