import { Observable, combineLatest } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';
import { ObjectId } from 'mongodb';

import { MongoDb } from '../../trash/db';
import { DB } from './../../db';
import { async } from '../../../async';

import { DIService } from '../../di';
import { JobRegister } from '../../../job-register';
import { PipeType } from '../pipe-type.enum';
import { PipeStatus } from '../pipe-status.enum';
import { PipeInput } from '../pipe-input.interface';
import { PipeMode } from '../pipe-mode.enum';

export interface Scheme {
	_id: string,
	id: string,
	options: any,
	input: any,
	jobName: JobRegister,
	services: DIService[],
	type: PipeType,
	label: string;
	config: any;
	children: Scheme[]
}

export class SnapshotPipesCreator3 {
	// private mongoDbProcessesPipes = new MongoDb('scheme-processes-pipe', true);
	private mongoDbProcessesPipes = new DB();
	private mongoDbScheme = new MongoDb('scheme', true);
	private mongoDbPipes = new MongoDb('pipes', true);
	private schemeId: string;
	private schemeCode: string;
	private processId: string;
	private modes: PipeMode[] = [];
	private rootModes: PipeMode[] = [];

	constructor(schemeId: string, schemeCode?: string) {
		this.schemeId = schemeId;
		this.schemeCode = schemeCode;
	}

	run(modes?: PipeMode[]) {
		if (modes) {
			this.modes = modes;
		}
		return async<PipeInput>()
			.pipe(
				mergeMap(() => {
					return this.fetchScheme();
				}),
				map(d => {
					if (modes) {
						if (d.config && typeof d.config === 'string') {
							d.config = JSON.parse(d.config);
						}
						d.config = d.config || { modes: [] };
						d.config.modes = modes;
						d.config = JSON.stringify(d.config);
					} else {
						let f = d.config || { modes: [] };
						if (d.config && typeof d.config === 'string') {
							f = JSON.parse(d.config);
						}
						this.rootModes = f.modes;
					}
					return d;
				}),
				mergeMap(d => {
					const scheme = d;
					this.schemeId = scheme._id.toString();
					if (scheme.id) {
						return this.fetchPipe(scheme.id)
							.pipe(
								mergeMap(pipe => {
									return this.createSchemeInput(scheme, pipe);
								})
							);
					}
					return this.createSchemeInput(scheme, null);
				})
			);
	}

	private createSchemeInput(scheme: Scheme, pipe?: Scheme, processId?: string, parent?: string): Observable<PipeInput> {
		const input: PipeInput = {
			processId: processId,
			schemeId: this.schemeId,
			entityId: scheme._id.toString(),
			options: scheme.options,
			input: scheme.input,
			type: scheme.type,
			label: scheme.label,
			jobName: pipe? pipe.jobName : JobRegister.NONE,
			services: scheme.services || [],
			children: [],
			config: scheme.config,
			path: '',
			parent: parent || '',
			process: {
				createdTime: Date.now(),
				startDate: null,
				endDate: null,
				error: '',
				status: PipeStatus.PENDING,
				input: '',
				output: ''
			}
		};

		if (!this.canUseDb()) {
			if (!scheme.children.length) {
				return async<PipeInput>(input);
			}
			return this.createPipeInputs(scheme.children, '', input._id)
				.pipe(
					map(children => {
						input.children = children;
						return input;
					})
				);
		}

		return async<PipeInput>(input)
			.pipe(
				mergeMap(input => {
					const id = this.mongoDbProcessesPipes.createId();
					// @ts-ignore
					input.id = id.toString();
					input.processId = id.toString();
					return this.mongoDbProcessesPipes.create(id, input)
						.pipe(
							map(r => {
								input._id = r.insertedId;
								input.processId = r.insertedId.toString();
								this.processId = input.processId;
								return input;
							})
							// ,
							// mergeMap(r => {
							// 	return this.mongoDbProcessesPipes
							// 		.updateOne(
							// 			{
							// 				_id: r.insertedId
							// 			},
							// 			{
							// 				$set: {
							// 					processId: r.insertedId.toString()
							// 				}
							// 			}
							// 		)
							// 		.pipe(
							// 			map(() => {
							// 				input._id = r.insertedId;
							// 				input.processId = r.insertedId.toString();
							// 				this.processId = input.processId;
							// 				return input;
							// 			})
							// 		);
							// })
						);
				}),
				mergeMap(input => {
					if (!scheme.children.length) {
						return async<PipeInput>(input);
					}
					return this.createPipeInputs(scheme.children, '', input._id)
						.pipe(
							map(children => {
								input.children = children;
								return input;
							})
						);
				})
			);
	}

	private parseConfig(config: any) {
		if (!config) {
			return {
				modes: []
			};
		}
		if (typeof config === 'string') {
			return JSON.parse(config);
		}
		return config;
	}

	private createPipeInputs(children: Scheme[], parentPath: string, parent: any) {
		const obs = children.map((c, i) => this.createPipeInput(c, parentPath, i, parent));
		return combineLatest(...obs);
	}

	private createPipeInput(child: Scheme, parentPath: string, order: number, parent: any): Observable<PipeInput> {
		return async<PipeInput>()
			.pipe(
				mergeMap(() => {
					return this.fetchPipe(child.id);
				}),
				map(pipe => {
					return <PipeInput>{
						entityId: pipe._id.toString(),
						schemeId: this.schemeId,
						processId: this.processId,
						options: child.options,
						input: child.input,
						parent: parent || '',
						type: child.type,
						jobName: pipe.jobName,
						label: pipe.label,
						services: child.services || [],
						children: [],
						config: child.config,
						path: parentPath + 'children.' + order,
						process: {
							createdTime: Date.now(),
							startDate: null,
							endDate: null,
							error: '',
							status: PipeStatus.PENDING,
							input: '',
							output: ''
						}
					};
				}),
				mergeMap(input => {
					if (!this.canUseDb()) {
						if (!child.children.length) {
							return async<PipeInput>(input);
						}
						return this.createPipeInputs(child.children, input.path + '.', input._id)
							.pipe(
								map(children => {
									input.children = children;
									return input;
								})
							);
					}
					return this.mongoDbProcessesPipes.create('', input)
						.pipe(
							map(r => {
								input._id = r.insertedId;
								return input;
							}),
							mergeMap(input => {
								if (!child.children.length) {
									return async<PipeInput>(input);
								}
								return this.createPipeInputs(child.children, input.path + '.', input._id)
									.pipe(
										map(children => {
											input.children = children;
											return input;
										})
									);
							})
						);
				})
			);
	}

	private fetchScheme(): Observable<Scheme> {
		if (this.schemeCode) {
			return this.mongoDbScheme.findOne({
				code: this.schemeCode
			});
		}
		return this.mongoDbScheme.findOne({
			_id: ObjectId(this.schemeId)
		});
	}

	private fetchPipe(pipeId: string) {
		return this.mongoDbPipes.findOne({
			_id: ObjectId(pipeId)
		});
	}

	private canUseDb() {
		const configModes = this.rootModes || [];
		const modes = configModes.concat(this.modes);
		if (!modes.length) {
			return true;
		}
		// if (!!~modes.indexOf(PipeMode.DB_BRANCHES_SYNC_ON_DONE)) {
		// 	return false;
		// }
		// if (!!~modes.indexOf(PipeMode.DB_NO_SYNC)) {
		// 	return false;
		// }
		// if (!!~modes.indexOf(PipeMode.DB_SYNC_ON_ERROR)) {
		// 	return false;
		// }
		// if (!!~modes.indexOf(PipeMode.DB_SYNC_ON_IN_PROCESS)) {
		// 	return false;
		// }
		// if (!!~modes.indexOf(PipeMode.DB_SYNC_ON_DONE)) {
		// 	return false;
		// }
		return false;
	}
}