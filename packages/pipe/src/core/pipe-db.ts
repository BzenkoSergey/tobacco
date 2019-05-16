import { Observable, combineLatest, Subject, merge } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ObjectId } from 'mongodb';
import  * as cassandra from "cassandra-driver";

import { CassandraDb } from './../core/db-cassandra';
import { async } from './../async';
import { DIService } from './di';
import { Process } from './pipe-process.interface';
import { DbService } from './db.service';
import { PipeMode } from './pipe-mode.enum';
import { PipeBase } from './pipe-base';
import { PipeStatus } from './pipe-status.enum';
import { Queue } from './queue';

let cols = 0;
export abstract class PipeDb extends PipeBase {
	private toSaveInput: any;
	private toSaveOutput: any;
	protected endSynced = false;
	protected children: PipeDb[];
	private isCreating = false;

	getIsCreating() {
		return this.isCreating;
	}

	getEndSynced() {
		return this.endSynced;
	}

	getProcessOutput() {
		if (!this.process.output || !this.canUseDb()) {
			return async();
		}
		return this.getDbProcessesData('getProcessOutput')
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
		if (!this.process.input || !this.canUseDb()) {
			return async();
		}
		return this.getDbProcessesData('getProcessInput')
			.findOne({
				_id: ObjectId(this.process.input)
			})
			.pipe(
				map(d => {
					return d.content;
				})
			);
	}

	sync(noCheck?: boolean) {
		if (!noCheck && !this.canUseDb()) {
			return async();
		}

		let subj: Observable<any>;
		if (this.processPipeId) {
			if (this.getEndSynced()) {
				// subj = async(ObjectId(this.processPipeId));
				subj = async(this.processPipeId);
			} else {
				subj = this.complexUpdate({
						process: this.process
					})
					.pipe(
						mergeMap(() => {
							const subjs = [];
							if (this.toSaveInput) {
								subjs.push(this.saveProcessInput(this.toSaveInput, true));
							}
							if (this.toSaveOutput) {
								subjs.push(this.saveProcessOutput(this.toSaveOutput, true));
							}
							return subjs.length ? combineLatest(...subjs) : async();
						}),
						map(() => {
							this.toSaveInput = null;
							this.toSaveOutput = null;
							this.defineEndSynced();
							return this.processPipeId;
							// return ObjectId(this.processPipeId);
						})
					);
			}
		} else {
			subj = this.createProcessPipe(true);
		}
		const scheme = this.getScheme();
		// this.log(scheme.path);

		return subj
			.pipe(
				mergeMap(processPipeId => {
					if (!this.children.length) {
						return async();
					}
					const subjs = this.children
						.map(c => {
							c.parent = processPipeId;
							return c;
						})
						.map(c => c.sync(true));
					return combineLatest(...subjs);
				})
			);
	}

	syncUpdate(noCheck?: boolean) {
		if (!noCheck && !this.canUseDb()) {
			return async();
		}

		if (!this.processPipeId) {
			return async(this.processPipeId);
		}

		let subj: Observable<any>;
		if (this.getEndSynced()) {
			subj = async(this.processPipeId);
		} else {
			subj = this.complexUpdate({
					process: this.process
				})
				.pipe(
					mergeMap(() => {
						const subjs = [];
						if (this.toSaveInput) {
							subjs.push(this.saveProcessInput(this.toSaveInput, true));
						}
						if (this.toSaveOutput) {
							subjs.push(this.saveProcessOutput(this.toSaveOutput, true));
						}
						return subjs.length ? combineLatest(...subjs) : async();
					}),
					map(() => {
						this.toSaveInput = null;
						this.toSaveOutput = null;
						this.defineEndSynced();
						return this.processPipeId;
					})
				);
		}

		return subj
			.pipe(
				mergeMap(() => {
					if (!this.children.length) {
						return async();
					}
					const subjs = this.children.map(c => c.syncUpdate(true));
					return combineLatest(...subjs);
				})
			);
	}

	protected saveProcessOutput(output: any, noCheck?: boolean): Observable<any> {
		if (!noCheck && !this.canUseDb()) {
			this.toSaveOutput = output;
			return async();
		}
		if (!this.process.output) {
			return this.getDbProcessesData('saveProcessOutput - insertOne')
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

		if (this.jobName === 'DELAY') {
			console.warn('SAVE OUT', this.jobName, this.processPipeId, this.process.input, output);
		}
		return this.getDbProcessesData('saveProcessOutput - updateOne').updateOne(
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

	protected saveProcessInput(input: any, noCheck?: boolean) {
		if (!noCheck && !this.canUseDb()) {
			this.toSaveInput = input;
			return async();
		}
		if (!this.process.input) {
			return this.getDbProcessesData('saveProcessInput - insertOne')
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

		if (this.jobName === 'DELAY') {
			console.warn('SAVE INPUT', this.jobName, this.processPipeId, this.process.input, input);
		}
		return this.getDbProcessesData('saveProcessInput - updateOne').updateOne(
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

	private updateObj = {};
	private times: any;
	private updating = false;
	private runNext2 = false;
	private performUpdate() {
		if (this.updating) {
			this.runNext2 = true;
			return async();
		}
		if(this.times) {
			clearTimeout(this.times);
		}
		if (!Object.keys(this.updateObj).length) {
			return async();
		}
		this.times = setTimeout(() => {
			this.updating = true;
			// console.log('========================');
			// console.log(this.updateObj);
			// console.log(this.schemeProcessId);
			// console.log('========================');
			this.getDbProcessesPipe('performUpdate')
				.updateOne(
					{
						// _id: ObjectId(this.processPipeId)
						id: this.processPipeId
						,
						// parent: this.parent,
						// processId: this.processPipeId,
						schemeId: this.schemeId
					},
					{
						$set: this.updateObj
					}
				)
				.subscribe(
					() => {
						this.updating = false;
						this.updateObj = {};
						if (this.runNext2) {
							this.runNext2 = false;
							this.performUpdate();
						}
					}
				);
		}, 3000);

		return async();
	}

	protected update(fields: (keyof Process)[]) {
		if (!this.canUseDb()) {
			return async();
		}
		if (!this.processPipeId) {
			return this.createBranchPipes();
		}
		const updateChildren = !!~this.getCurrentModes().indexOf(PipeMode.DB_BRANCHES_SYNC_ON_DONE) && this.process.status === PipeStatus.DONE;
		if (updateChildren) {

			if (this.schemeId !== '5c4508e8ffcf831adc62a385') {
				// debugger;
				// console.log('update => syncUpdate()');
			}
			return this.syncUpdate();
		}
		this.log('update', this.path, this.process.status);
		const pathProcess = 'process';
		fields.forEach(p => {
			this.updateObj[pathProcess + '.' + p] = this.process[p];
		});
		this.defineEndSynced();
		return this.performUpdate();
	}

	private defineEndSynced() {
		if (this.process.status === PipeStatus.DONE || this.process.status === PipeStatus.ERROR) {
			this.endSynced = true;
		} else {
			this.endSynced = false;
		}
	}

	afterCreatings() {
		if (!this.isCreating) {
			return async(this.processPipeId);
			// return async(ObjectId(this.processPipeId));
		}
		const subj = new Subject();
		const interval = setInterval(() => {
			if (this.processPipeId) {
				clearInterval(interval);
				// subj.next(ObjectId(this.processPipeId));
				subj.next(this.processPipeId);
				subj.complete();
			}
		}, 10);
		return subj;
	}

	createBranchPipes() {
		if (!this.canUseDb()) {
			return async();
		}
		const createChildren = !!~this.getCurrentModes().indexOf(PipeMode.DB_BRANCHES_SYNC_ON_DONE) && this.process.status === PipeStatus.DONE;
		if (this.processPipeId) {
			if (createChildren) {
				return this.sync();
			}
			return async(this.processPipeId);
			// return async(ObjectId(this.processPipeId));
		}

		const parent = this.findParentToCreate();
		if (!parent) {
			// this.parent = ObjectId(this.parentPipe.getProcessPipeId());
			this.parent = this.parentPipe.getProcessPipeId();
			debugger;
		}
		const list = this.getPipesToCreate(parent, this);
		const queue = new Queue();
		const subjs = list.map(i => {
			return queue.run(() => {
				return i.createProcessPipe(true);
			});
		});
		return combineLatest(...subjs)
			.pipe(
				mergeMap(() => {
					queue.destroy();
					if (createChildren) {
						return this.sync()
					}
					return async();
				})
			);
	}

	createProcessPipe(noCheck?: boolean): Observable<ObjectId> {
		if (!noCheck && !this.canUseDb()) {
			return async();
		}
		if (this.processPipeId) {
			return async(this.processPipeId);
			// return async(ObjectId(this.processPipeId));
		}
		if (this.isCreating) {
			return this.afterCreatings();
		}

		if (this.parentPipe && this.parentPipe.getProcessPipeId()) {
			// this.parent = ObjectId(this.parentPipe.getProcessPipeId());
			this.parent = this.parentPipe.getProcessPipeId();
		}
		const clone = Object.assign({}, this.getScheme());
		clone.children = [];
		const id = cassandra.types.Uuid.random();
		if (this.getPath() === '') {
			this.setSchemeProcessId(id.toString());
			clone.processId = id.toString();

			console.log('======================')
			console.log('======================')
			console.log('======================')
			console.log(clone.processId, id.toString(), this.label)
			console.log('======================')
			console.log('======================')
			console.log('======================')
			console.log('======================')
			console.log('======================')
		}
		// @ts-ignore
		clone.id = id;
		this.log('create', this.path, this.process.status);
		this.isCreating = true;
		return this.getDbProcessesPipe('insertOne').insertOne(clone)
			.pipe(
				mergeMap(r => {
					if (this.getPath() === '') {
					console.log('----------------------')
					console.log('----------------------')
					console.log('----------------------')
					console.log(r.insertedId.toString(), this.label)
					console.log('----------------------')
					console.log('----------------------')
					console.log('----------------------')
					console.log('----------------------')
					console.log('----------------------')
					}
					this.processPipeId = r.insertedId.toString();
					if (this.getPath() === '') {
						this.setSchemeProcessId(this.processPipeId);
					}
					return async()
						.pipe(
							mergeMap(() => {
								const subjs = [];
								if (this.toSaveInput) {
									subjs.push(this.saveProcessInput(this.toSaveInput, true));
								}
								if (this.toSaveOutput) {
									subjs.push(this.saveProcessOutput(this.toSaveOutput, true));
								}
								return subjs.length ? combineLatest(...subjs) : async();
							}),
							mergeMap(() => {
								this.toSaveInput = null;
								this.toSaveOutput = null;
								const subj = (this.getChildren() as PipeDb[])
									.map(c => {
										c.parent = r.insertedId
										if (c.processPipeId) {
											if(c.getIsCreating()) {
												return c.afterCreatings()
													.pipe(
														mergeMap(() => {
															return c.complexUpdate({parent: c.parent});
														})
													)
											}
											return c.complexUpdate({parent: c.parent});
										}
										return async();
									});
								if (!subj.length) {
									return async(r.insertedId);
								}
								return combineLatest(...subj)
									.pipe(
										map(() => r.insertedId)
									);
							}),
							mergeMap((id: ObjectId) => {
								if (this.getPath() === '' || this.process.input || this.process.output) {
									if (typeof this.schemeProcessId !== 'string') {
										debugger;
									}
									const toUpdate: any = {
										'process.input': this.process.input,
										'process.output': this.process.output
									};
									if (clone.processId !== this.schemeProcessId) {
										toUpdate.processId = this.schemeProcessId;
										console.log('89723876923486712937986413123497--------------------');
										console.log(clone.processId, this.schemeProcessId);
										console.log('89723876923486712937986413123497--------------------');
									}
									return this.complexUpdate(toUpdate)
										.pipe(
											mergeMap(() => async<ObjectId>(id))
										);
								}
								return async<ObjectId>(id);
							}),
							map(d => {
								this.isCreating = false;
								this.defineEndSynced();
								return d;
							})
						);
				})
			);
	}

	private complexUpdate(d) {
		// console.log('//////////////////////////////');
		// console.log(d);
		// console.log(this.schemeProcessId);
		// console.log('//////////////////////////////');
		return this.getDbProcessesPipe('complexUpdate')
			.updateOne(
				{
					// _id: ObjectId(this.processPipeId)
					id: this.processPipeId
					,
					// parent: this.parent,
					// processId: this.processPipeId,
					schemeId: this.schemeId
				},
				{
					$set: d
				}
			);
	}

	private getPipesToCreate(parent: PipeDb|null, child: PipeDb, list: PipeDb[] = [], addParent = true): PipeDb[] {
		const path = child.getPath();
		if (addParent && parent) {
			list.push(parent);
		}
		if (path === '' || !parent) {
			list.push(child);
			return list;
		}
		const itemToCreate = parent.getChildren()
			.find(c => {
				const childPath = c.getPath();
				return path.startsWith(childPath);
			}) as PipeDb;
		list.push(itemToCreate);
		if (itemToCreate === child) {
			return list;
		}
		if (!itemToCreate) {
			debugger;
		}
		if (!itemToCreate.getChildren().length) {
			return list;
		}
		return this.getPipesToCreate(itemToCreate, child, list, false);
	}

	private findParentToCreate(child?: PipeDb) {
		child = child || this;
		if (child.processPipeId) {
			return null;
		}
		if (child.getPath() === '') {
			return child;
		}
		const parent = this.findParentToCreate(child.parentPipe as PipeDb);
		if (!parent && child !== this) {
			debugger;
			return child;
		}
		return parent;
	}

	private getDbProcessesPipe(info?: string) {
		cols = cols + 1;
		if (this.process.status === PipeStatus.DONE) {
			// console.error('cols', cols);
			// console.error('cols', 'PIPE', this.path, this.process.status, info, this.processPipeId);
		}

		return new CassandraDb('');
		// return this.di.get<DbService>(this.path, DIService.DB).get('scheme-processes-pipe');
	}

	private getDbProcessesData(info?: string) {
		cols = cols + 1;
		if (this.process.status === PipeStatus.DONE) {
			// console.error('cols', cols);
			// console.error('cols', 'DATA', this.path, this.process.status, info, this.processPipeId);
		}
		return this.di.get<DbService>(this.path, DIService.DB).get('scheme-processes-data');
	}

	private getCurrentModes() {
		return this.getConfig().modes || [];
	}

	private canUseDb() {
		if (this.process.status === PipeStatus.ERROR) {
			return true;
		}

		// {"modes": ["DB_SYNC_ON_DONE"]}
		const allwed = [PipeMode.RUN_ONCE, PipeMode.SCHEME_TO_CLONE];
		const modes = this.getModes();
		const currentModes = this.getCurrentModes();
		const f = modes.filter(i => !~allwed.indexOf(i))
		if (!f.length) {
			// this.log('ALLOW DB - !!!!', this.getPath(), currentModes, this.type);
			return true;
		}
		if (!!~modes.indexOf(PipeMode.DB_SYNC_ON_ERROR) && this.process.status === PipeStatus.ERROR as any) {
			// this.log('ALLOW DB - DB_SYNC_ON_ERROR !!!!', this.getPath(), currentModes, this.type);
			return true;
		}
		if (!!~modes.indexOf(PipeMode.DB_SYNC_ON_IN_PROCESS) && this.process.status === PipeStatus.IN_PROCESS) {
			// this.log('ALLOW DB - DB_SYNC_ON_IN_PROCESS !!!!', this.getPath(), currentModes, this.type);
			return true;
		}
		if (
			(!!~currentModes.indexOf(PipeMode.DB_SYNC_ON_DONE) || 
			!!~currentModes.indexOf(PipeMode.DB_BRANCHES_SYNC_ON_DONE)) && 
			this.process.status === PipeStatus.DONE) {
			// this.log('ALLOW DB - DB_SYNC_ON_DONE !!!!', this.getPath(), currentModes, this.type);
			return true;
		}
		// console.warn('NOT SAVE!!!!!!!!!! UN ALOWW');
		if (!!~modes.indexOf(PipeMode.DB_NO_SYNC)) {
			// this.log('NO ALLOW DB - DB_NO_SYNC !!!!');
			return false;
		}
		// this.log('NO ALLOW DB !!!!');
		return false;
	}

	private log(...ags) {
		if (this.schemeId !== '5c4508e8ffcf831adc62a384') {
			return;
		}
		// console.log(...ags);
	}
}