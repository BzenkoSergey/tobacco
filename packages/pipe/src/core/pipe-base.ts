import { throwError, Observable, combineLatest } from 'rxjs';
import { mergeMap, map, tap } from 'rxjs/operators';
import { ObjectId } from 'mongodb';

import { async } from './../async';
import { DI, DIService } from './di';
import { MongoDb } from './../core/db';
import { PipeType } from './pipe-type.enum';
import { PipeStatus } from './pipe-status.enum';

import { JobRegister } from './../job-register';
import { JobConstructor, Job } from './../jobs/job.interface';
import { Navigator } from './navigator';
import { PipeInput } from './pipe-input.interface';
import { Process } from './pipe-process.interface';
import { ProcessPipeInput } from './process-pipe-input.interface';
import { SchemeProcessService } from './scheme-process.service';
import { DbService } from './db.service';

export abstract class PipeBase {
	protected runPaths: string[] = [];
	protected runOptions: any;
	protected di: DI;
	protected schemeProcessId: string;
	protected processPipeId: string;
	protected navigator: Navigator;
	protected job: JobConstructor;
	protected jobInstance: Job;

	protected id: string; // process id
	protected entityId: string; // entity id like Pipe, Pipeline
	protected schemeId: string;
	protected type = PipeType.PIPE;
	protected jobName: JobRegister;
	protected label: string;
	protected process: Process;
	protected path: string;
	protected services: DIService[] = [];
	protected options: any;
	protected input: any;
	protected children: PipeBase[] = [];
	protected isolated = false;
	protected parent: ObjectId;

	constructor(d?: PipeInput, isolated = false) {
		this.isolated = isolated;
		if (!d) {
			return;
		}
		this.defineProperties(d);
	}

	abstract cloneChild(childPath: string, input: any, run?: boolean);
	abstract init(processInput: ProcessPipeInput): Observable<any>;

	// getDbProcesses() {
	// 	return this.di.get<SchemeProcessService>(this.path, DIService.SCHEME_PROCESS);
	// 	// return new MongoDb('scheme-processes', true);
	// }

	getDbProcessesPipe() {
		return this.di.get<DbService>(this.path, DIService.DB).get('scheme-processes-pipe');
		// return new MongoDb('scheme-processes-pipe', false);
	}

	getDbProcessesData() {
		return this.di.get<DbService>(this.path, DIService.DB).get('scheme-processes-data');
		// return new MongoDb('scheme-processes-data', false);
	}

	// getDbProcessesOptions() {
	// 	return new MongoDb('scheme-processes-options', true);
	// }

	resetStatus() {
		this.process.status = PipeStatus.PENDING;
		this.children.forEach(c => c.resetStatus());
		return this;
	}

	getChildren() {
		return this.children;
	}

	getType() {
		return this.type;
	}

	setDI(di: DI) {
		this.di = di;
		this.children.forEach(c => c.setDI(di));
		return this;
	}

	setRunParts(parts: string[]) {
		this.runPaths = parts;
		return this;
	}

	getInput() {
		return this.input;
	}

	getOptions() {
		if (!this.options) {
			return async();
		}
		return async(JSON.parse(this.options));
		// if (!this.options) {
		// 	return async();
		// }
		// return this.getDbProcessesOptions()
		// 	.findOne({
		// 		_id: ObjectId(this.options)
		// 	})
		// 	.pipe(
		// 		map(d => {
		// 			return JSON.parse(d.content);
		// 		})
		// 	);
	}

	getPath() {
		return this.path;
	}

	setSchemeProcessId(schemeProcessId: string) {
		this.schemeProcessId = schemeProcessId;
		if (this.children.length) {
			this.children.forEach(c => c.setSchemeProcessId(schemeProcessId));
		}
		return this;
	}

	getProcessOutput() {
		if (!this.process.output) {
			return async();
		}
		return this.getDbProcessesData()
			.findOne({
				_id: ObjectId(this.process.output)
			})
			.pipe(
				map(d => {
					return d.content;
				})
			);
	}

	getProcessInput() {
		if (!this.process.input) {
			return async();
		}
		return this.getDbProcessesData()
			.findOne({
				_id: ObjectId(this.process.input)
			})
			.pipe(
				map(d => {
					return d.content;
				})
			);
	}

	getScheme(): PipeInput {
		// console.log(this.schemeProcessId);
		return {
			id: this.id,
			entityId: this.entityId,
			schemeId: this.schemeId,
			processId: this.schemeProcessId,
			type: this.type,
			jobName: this.jobName,
			label: this.label,
			parent: this.parent,
			services: this.services,
			// children: this.children.map(c => c.p),
			children: this.children.map(c => c.getScheme()),
			options: this.options,
			input: this.input,
			path: this.path,
			process: this.process
		}
	}

	sync() {
		if (this.processPipeId) {
			return async();
		}
		const scheme = this.getScheme();
		console.log(scheme.path);
		return this.createProcessPipe(scheme)
			.pipe(
				// mergeMap(processPipeId => {
				// 	this.processPipeId = processPipeId;
				// 	return this.updateChildScheme(processPipeId, scheme.path)
				// }),
				mergeMap(processPipeId => {
					this.processPipeId = processPipeId.toString();
					if (!this.children.length) {
						return async();
					}
					const subjs = this.children
						.map(c => {
							c.parent = processPipeId;
							return c;
						})
						.map(c => c.sync());
					return combineLatest(...subjs);
				})
			);
	}

	protected defineProperties(d: PipeInput) {
		this.id = d.id;
		this.entityId = d.entityId;
		this.schemeId = d.schemeId;
		this.type = d.type;
		this.jobName = d.jobName;
		this.label = d.label;
		this.process = d.process;
		this.services = d.services || [];
		this.options = d.options;
		this.input = d.input;
		this.path = d.path;
		this.children = [];
		this.parent = d.parent;
	}

	protected fetchProcessPipe() {
		return this.getDbProcessesPipe().findOne({
			_id: ObjectId(this.processPipeId)
		});
	}

	protected runAsBranch() {
		if (!this.runPaths || !this.runPaths.length) {
			return true;
		}
		return this.runPaths.some(p => {
			return p.startsWith(this.path);
		});
	}

	protected canRun(): boolean {
		if (!this.runPaths || !this.runPaths.length) {
			return true;
		}
		return this.runPaths.some(p => this.isAfterOrSamePath(p));
	}

	protected isAfterOrSamePath(path: string) {
		if (!this.path && path) {
			return false;
		}
		if (this.path === path) {
			return true;
		}
		return this.path.startsWith(path + '.');
	}

	protected createProcessPipe(scheme: PipeInput) {
		const clone = Object.assign({}, scheme);
		clone.children = [];
		return this.getDbProcessesPipe().insertOne(clone)
			.pipe(
				map(r => r.insertedId)
			);
	}

	// protected updateChildScheme(processPipeId: string, path: string) {
	// 	const update = {
	// 		$set: {}
	// 	};

	// 	// console.error('==================');
	// 	// console.error(this.schemeProcessId, processPipeId, path);
	// 	// console.log(path);

	// 	update.$set[path] = {
	// 		id: processPipeId,
	// 		children: []
	// 	};
	// 	return this.getDbProcesses().update(this.schemeProcessId, update);
	// 	// return this.getDbProcesses().updateOne(
	// 	// 	{
	// 	// 		_id: ObjectId(this.schemeProcessId)
	// 	// 	},
	// 	// 	update
	// 	// );
	// }

	protected defineMeta(scheme: PipeInput, parentPath: string, nextIndex: number) {
		const path = parentPath + '.children.' + nextIndex;
		scheme.path = path;
		scheme.process = {
			createdTime: Date.now(),
			startDate: null,
			endDate: null,
			error: '',
			status: PipeStatus.PENDING,
			input: '',
			output: ''
		};
		if (!scheme.children.length) {
			return;
		}
		scheme.children.forEach((c, i) => this.defineMeta(c, path, i));
	}

	protected prepare() {
		this.services.forEach(s => this.di.registrate(this.path, s));
		this.navigator = this.di.get<Navigator>(this.path, DIService.NAVIGATOR);
		this.navigator.add(this.path, this);
		this.job = JobRegister.getJob(this.jobName);
	}

	protected handleError(e) {
		try {
			this.process.endDate = Date.now();
			this.process.status = PipeStatus.ERROR;
			this.process.error = e.toString();
	
			return this.update(['endDate', 'status', 'error'])
				.pipe(
					mergeMap(() => throwError(e))
				);
		} catch(e) {
			return throwError(e);
		}
	}

	protected saveProcessOutput(output: any) {
		if (!this.process.output) {
			return this.getDbProcessesData()
				.insertOne({
					content: output
				})
				.pipe(
					mergeMap(d => {
						this.process.output = d.insertedId.toString();
						return this.update(['output']);
					})
				);
		}

		return this.getDbProcessesData().updateOne(
			{
				_id: ObjectId(this.process.output)
			},
			{
				$set: {
					content: output
				}
			}
		);
	}

	protected saveProcessInput(input: any) {
		if (!this.process.input) {
			return this.getDbProcessesData()
				.insertOne({
					content: input
				})
				.pipe(
					mergeMap(d => {
						this.process.input = d.insertedId.toString();
						return this.update(['input']);
					})
				);
		}

		return this.getDbProcessesData().updateOne(
			{
				_id: ObjectId(this.process.input)
			},
			{
				$set: {
					content: input
				}
			}
		);
	}

	protected update(fields: (keyof Process)[]) {
		const update = {
			$set: {}
		};

		const toUpdate = {};
		const pathProcess = 'process';
		const set: any = {};
		fields.forEach(p => {
			set[pathProcess + '.' + p] = this.process[p];
		});
		// toUpdate.input = toUpdate.input;
		// toUpdate.output = toUpdate.output;

		update.$set['process'] = toUpdate;
		return this.getDbProcessesPipe().updateOne(
			{
				_id: ObjectId(this.processPipeId)
			},
			{
				$set: set
			}
		);
	}

	// protected update(fields: (keyof Process)[]) {
	// 	const update = {
	// 		$set: {}
	// 	};
	// 	let path = this.path;
	// 	if (path) {
	// 		path = path + '.';
	// 	}
	// 	const toUpdate = {
	// 		// ...this.process
	// 	};
	// 	const pathProcess = path + 'process';
	// 	const set: any = {};
	// 	fields.forEach(p => {
	// 		set[pathProcess + '.' + p] = this.process[p];
	// 	});
	// 	// toUpdate.input = toUpdate.input;
	// 	// toUpdate.output = toUpdate.output;

	// 	update.$set[path + 'process'] = toUpdate;
	// 	return this.mongoDbProcesses.updateOne(
	// 		{
	// 			_id: ObjectId(this.schemeProcessId)
	// 		},
	// 		{
	// 			$set: set
	// 		}
	// 	);
	// }

	protected isEmpty(obj: any) {
		if (!obj) {
			return true;
		}
		return !!Object.keys(obj).length;
	}
}