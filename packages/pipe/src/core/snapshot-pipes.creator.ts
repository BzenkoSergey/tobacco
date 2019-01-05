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


/**
 * 
 * {
 * 	_id: string,
 *  children: []
 * }
 */

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

export class SnapshotPipesCreator {
	private mongoDbProcesses = new MongoDb('scheme-processes', true);
	private mongoDbProcessesOptions = new MongoDb('scheme-processes-options', true);
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
		return async()
			.pipe(
				mergeMap(() => {
					return this.fetchScheme();
				}),
				mergeMap(d => {
					return this.createScheme({
						id: null,
						children: [],
						createdDate: Date.now().toString()
					})
					.pipe(
						map(processId => {
							this.processId = processId;
							return <[Scheme, string]>[d, processId];
						})
					);
				}),
				mergeMap(d => {
					const scheme = d[0];
					const processId = d[1];
					this.schemeId = scheme._id.toString();
					if (scheme.id) {
						return this.fetchPipe(scheme.id)
							.pipe(
								mergeMap(pipe => {
									return this.createSchemeInput(scheme, pipe, processId)
										.pipe(
											map(r => {
												return <[ProcessPipeInput, string]>[r, processId];
											})
										);
								})
							);
					}
					return this.createSchemeInput(scheme, null, processId)
						.pipe(
							map(r => {
								return <[ProcessPipeInput, string]>[r, processId];
							})
						);
				}),
				mergeMap(d => {
					const processInput = d[0];
					const processId = d[1];
					processInput.entityId = this.schemeId;
					processInput._id = processId;
					return this.saveScheme(processInput)
						.pipe(
							map(() => processInput)
						);
				})
			);
	}

	private saveOptions(options: any) {
		return this.mongoDbProcessesOptions
			.insertOne({
				content: options
			})
			.pipe(
				map(d => {
					return d.insertedId.toString();
				})
			);
	}

	private createSchemeInput(scheme: Scheme, pipe?: Scheme, processId?: string): Observable<ProcessPipeInput> {
		const input: PipeInput = {
			id: scheme.id,
			processId: processId,
			schemeId: this.schemeId,
			entityId: scheme._id.toString(),
			options: null,
			input: scheme.input,
			type: scheme.type,
			label: scheme.label,
			jobName: pipe? pipe.jobName : JobRegister.NONE,
			services: scheme.services || [],
			children: [],
			path: '',
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
				mergeMap(input => {
					if (!scheme.options) {
						return async(input);
					}
					return this.saveOptions(scheme.options)
						.pipe(
							map(optionsId => {
								input.options = optionsId;
								return input;
							})
						);
				}),
				mergeMap(input => {
					if (!scheme.children.length) {
						return async<[PipeInput, ProcessPipeInput[]]>([input, []]);
					}
					return this.createPipeInputs(scheme.children, '')
						.pipe(
							map(children => {
								// input.children = children;
								return <[PipeInput, ProcessPipeInput[]]>[input, children];
							})
							// ,
							// map(() => {
							// 	return input;
							// })
						);
				}),
				mergeMap(data => {
					const input = data[0];
					const childrenInputs = data[1];
					return this.mongoDbProcessesPipes.insertOne(input)
						.pipe(
							map(r => {
								return {
									id: r.insertedId.toString(),
									children: childrenInputs,
									createdDate: Date.now().toString()
								};
							})
						);
				})
			);
	}

	private createPipeInputs(children: Scheme[], parentPath: string) {
		const obs = children.map((c, i) => this.createPipeInput(c, parentPath, i));
		return combineLatest(...obs);
	}

	private createPipeInput(child: Scheme, parentPath: string, order: number): Observable<ProcessPipeInput> {
		return async<ProcessPipeInput>()
			.pipe(
				mergeMap(() => {
					return this.fetchPipe(child.id);
				}),
				mergeMap(pipe => {
					if (!child.options) {
						return async({
							pipe: pipe,
							optionsId: null
						});
					}
					return this.saveOptions(child.options)
						.pipe(
							map(optionsId => {
								return {
									pipe: pipe,
									optionsId: optionsId
								};
							})
						);
				}),
				map(d => {
					const pipe = d.pipe;
					const optionsId = d.optionsId;

					return {
						id: Identifier.generate(),
						entityId: pipe._id.toString(),
						schemeId: this.schemeId,
						processId: this.processId,
						options: optionsId,
						input: child.input,
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
					if (!child.children.length) {
						return async<[PipeInput, ProcessPipeInput[]]>([input, []]);
					}
					return this.createPipeInputs(child.children, input.path + '.')
						.pipe(
							map(childrenInputs => {
								return <[PipeInput, ProcessPipeInput[]]>[input, childrenInputs];
							})
						);
				}),
				mergeMap(data => {
					const input = data[0];
					const childrenInputs = data[1];

					return this.mongoDbProcessesPipes.insertOne(input)
						.pipe(
							map(r => {
								return {
									id: r.insertedId.toString(),
									children: childrenInputs,
									entityId: input.entityId,
									createdDate: Date.now().toString()
								}
							})
						);
				})
			);
	}

	createScheme(scheme: ProcessPipeInput): Observable<string> {
		return this.mongoDbProcesses.insertOne(scheme)
			.pipe(
				map(d => {
					return d.insertedId.toString();
				})
			);
	}

	saveScheme(scheme: ProcessPipeInput) {
		const update = {
			$set: {}
		};
		Object.keys(scheme)
			.forEach(prop => {
				if (prop === '_id') {
					return;
				}
				update.$set[prop] = scheme[prop];
			});

		return this.mongoDbProcesses.updateOne(
			{
				_id: ObjectId(scheme._id)
			},
			update
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