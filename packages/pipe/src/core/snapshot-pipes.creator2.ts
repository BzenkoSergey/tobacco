import { Observable, combineLatest } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';
import { ObjectId } from 'mongodb';
import { MongoDb } from './../core/db';
import { async } from './../async';

import { DIService } from './di';
import { JobRegister } from './../job-register';
import { PipeType } from './pipe-type.enum';
import { PipeStatus } from './pipe-status.enum';
import { Identifier } from './identifier';
import { PipeInput } from './pipe-input.interface';
import { ProcessPipeInput } from './process-pipe-input.interface';

export interface Scheme {
	_id: string,
	id: string,
	options: any,
	input: any,
	jobName: JobRegister,
	services: DIService[],
	type: PipeType,
	label: string;
	children: Scheme[]
}

export class SnapshotPipesCreator2 {
	// private mongoDbProcessesOptions = new MongoDb('scheme-processes-options', true);
	private mongoDbProcessesPipes = new MongoDb('scheme-processes-pipe', true);
	private mongoDbScheme = new MongoDb('scheme', true);
	private mongoDbPipes = new MongoDb('pipes', true);
	private schemeId: string;
	private schemeCode: string;
	private processId: string;

	constructor(schemeId: string, schemeCode?: string) {
		this.schemeId = schemeId;
		this.schemeCode = schemeCode;
	}

	run() {
		return async<ProcessPipeInput>()
			.pipe(
				mergeMap(() => {
					return this.fetchScheme();
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

	// private saveOptions(options: any) {
	// 	return this.mongoDbProcessesOptions
	// 		.insertOne({
	// 			content: options
	// 		})
	// 		.pipe(
	// 			map(d => {
	// 				return d.insertedId.toString();
	// 			})
	// 		);
	// }

	private createSchemeInput(scheme: Scheme, pipe?: Scheme, processId?: string, parent?: string): Observable<ProcessPipeInput> {
		const input: PipeInput = {
			id: scheme.id,
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
			path: '',
			parent: parent,
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

		return async<PipeInput>(input)
			.pipe(
				// mergeMap(input => {
				// 	if (!scheme.options) {
				// 		return async(input);
				// 	}
				// 	return this.saveOptions(scheme.options)
				// 		.pipe(
				// 			map(optionsId => {
				// 				input.options = optionsId;
				// 				return input;
				// 			})
				// 		);
				// }),
				mergeMap(input => {
					return this.mongoDbProcessesPipes.insertOne(input)
						.pipe(
							mergeMap(r => {
								return this.mongoDbProcessesPipes
									.updateOne(
										{
											_id: r.insertedId
										},
										{
											$set: {
												processId: r.insertedId.toString()
											}
										}
									)
									.pipe(
										map(() => {
											input._id = r.insertedId;
											input.processId = r.insertedId.toString();
											this.processId = input.processId;
											return input;
										})
									);
							})
						);
				}),
				mergeMap(input => {
					const f: ProcessPipeInput = {
						id: input._id.toString(),
						children: [],
						createdDate: Date.now().toString()
					}
					if (!scheme.children.length) {
						return async<ProcessPipeInput>(f);
					}
					return this.createPipeInputs(scheme.children, '', input._id)
						.pipe(
							map(children => {
								f.children = children;
								return f;
							})
						);
				})
			);
	}

	private createPipeInputs(children: Scheme[], parentPath: string, parent: any) {
		const obs = children.map((c, i) => this.createPipeInput(c, parentPath, i, parent));
		return combineLatest(...obs);
	}

	private createPipeInput(child: Scheme, parentPath: string, order: number, parent: any): Observable<ProcessPipeInput> {
		return async<PipeInput>()
			.pipe(
				mergeMap(() => {
					return this.fetchPipe(child.id);
				}),
				map(pipe => {
					return <PipeInput>{
						id: Identifier.generate(),
						entityId: pipe._id.toString(),
						schemeId: this.schemeId,
						processId: this.processId,
						options: child.options,
						input: child.input,
						parent: parent,
						type: child.type,
						jobName: pipe.jobName,
						label: pipe.label,
						services: child.services || [],
						children: [],
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
					return this.mongoDbProcessesPipes.insertOne(input)
						.pipe(
							map(r => {
								input._id = r.insertedId;
								return input;
							})
						);
				}),
				mergeMap(input => {
					const f: ProcessPipeInput = {
						id: input._id.toString(),
						children: [],
						createdDate: Date.now().toString()
					}

					if (!child.children.length) {
						return async<ProcessPipeInput>(f);
					}
					return this.createPipeInputs(child.children, input.path + '.', input._id)
						.pipe(
							map(children => {
								f.children = children;
								return f;
							})
						);
				})
			);
	}

	fetchScheme(): Observable<Scheme> {
		if (this.schemeCode) {
			return this.mongoDbScheme.findOne({
				code: this.schemeCode
			});
		}
		return this.mongoDbScheme.findOne({
			_id: ObjectId(this.schemeId)
		});
	}

	fetchPipe(pipeId: string) {
		return this.mongoDbPipes.findOne({
			_id: ObjectId(pipeId)
		});
	}
}