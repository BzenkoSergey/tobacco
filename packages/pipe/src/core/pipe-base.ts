import { throwError, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ObjectId } from 'mongodb';

import { async } from './../async';
import { DI, DIService } from './di';
import { PipeType } from './pipe-type.enum';
import { PipeStatus } from './pipe-status.enum';

import { JobRegister } from './../job-register';
import { JobConstructor, Job } from './../jobs/job.interface';
import { Navigator } from './navigator';
import { PipeInput } from './pipe-input.interface';
import { Process } from './pipe-process.interface';
import { PipeMode } from './pipe-mode.enum';

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
	protected parentPipe: PipeBase;
	protected config: {
		modes: string[]
	};
	protected limit: number;

	constructor(d: PipeInput, isolated = false) {
		this.isolated = isolated;
		if (!d) {
			return;
		}
		this.defineProperties(d);
	}

	setParentPipe(parentPipe: PipeBase) {
		this.parentPipe = parentPipe;
		return this;
	}

	getLimit() {
		let limit = this.limit;
		if (!limit && !this.parentPipe) {
			return 1;
		}
		if (!limit) {
			limit = this.parentPipe.getLimit();
		}
		return limit;
	}

	abstract cloneChild(childPath: string, input: any, run?: boolean);
	// abstract init(processInput: PipeInput): Observable<any>;
	protected abstract update(fields: (keyof Process)[]): Observable<any>;

	protected getModes() {
		const modes = this.getConfig().modes;
		let parentConfig = [];
		if (this.parentPipe) {
			parentConfig = this.parentPipe.getModes();
		}
		return modes.concat(parentConfig);
	}

	resetStatus() {
		this.process.status = PipeStatus.PENDING;
		this.children.forEach(c => c.resetStatus());
		return this;
	}

	getProcessPipeId() {
		return this.processPipeId;
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

	setInput(input: any) {
		this.input = input;
	}

	setConfig(config: any) {
		this.config = config;
		return this;
	}

	getConfig() {
		if (!this.config) {
			return { modes: [] }
		}
		if (typeof this.config === 'string') {
			const d = JSON.parse(this.config);
			d.modes = d.modes || [];
			return d;
		}
		return this.config;
	}

	getOptions() {
		if (!this.options) {
			return async();
		}
		return async(JSON.parse(this.options));
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

	getScheme(): PipeInput {
		return {
			entityId: this.entityId,
			schemeId: this.schemeId,
			processId: this.schemeProcessId,
			config: this.config,
			type: this.type,
			jobName: this.jobName,
			label: this.label,
			parent: this.parent,
			services: this.services,
			children: this.children.map(c => c.getScheme()),
			options: this.options,
			input: this.input,
			path: this.path,
			process: this.process
		}
	}

	protected defineProperties(d: PipeInput) {
		this.config = d.config || this.config;
		this.processPipeId = d._id;
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

		const config = this.getConfig();
		if (config.limit) {
			this.limit = config.limit;
		}
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
		this.navigator.add(this.path, this as any);
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
}