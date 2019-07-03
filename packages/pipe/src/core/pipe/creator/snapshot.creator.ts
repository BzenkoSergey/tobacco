import { Observable, combineLatest } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';
import { ObjectId } from 'mongodb';
import { MongoDb } from '../../trash/db';
import { async } from '../../../async';

import { DIService } from '../../di';
import { JobRegister } from '../../../job-register';
import { PipeType } from '../pipe-type.enum';
import { PipeStatus } from '../pipe-status.enum';
import { Identifier } from '../../identifier';
import { PipeInput } from '../pipe-input.interface';

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

export class SnapshotCreator {
	private mongoDbProcesses = new MongoDb('scheme-processes', true);
	private mongoDbProcessesOptions = new MongoDb('scheme-processes-options', true);
	private mongoDbProcessesPipes = new MongoDb('scheme-processes-pipe', true);
	private mongoDbScheme = new MongoDb('scheme', true);
	private mongoDbPipes = new MongoDb('pipes', true);
	private schemeId: string;
	private schemeCode: string;

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
					this.schemeId = d._id.toString();
					if (d.id) {
						return this.fetchPipe(d.id)
							.pipe(
								mergeMap(pipe => {
									return this.createSchemeInput(d, pipe);
								})
							);
					}
					return this.createSchemeInput(d);
				}),
				mergeMap(d => {
					return this.createScheme(d)
						.pipe(
							tap(r => {
								d.id = r.insertedId.toString();
							}),
							mergeMap(() => {
								return this.saveScheme(d);
							}),
							map(() => {
								return d;
							})
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

	private createSchemeInput(scheme: Scheme, pipe?: Scheme): Observable<PipeInput> {
		const input: PipeInput = {
			id: scheme.id,
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
						return async(input);
					}
					return this.createPipeInputs(scheme.children, '')
						.pipe(
							tap(children => {
								input.children = children;
							}),
							map(() => {
								return input;
							})
						);
				}),
				mergeMap(input => {
					return this.mongoDbProcessesPipes.insertOne(input)
						.pipe(
							map(() => input)
						);
				})
			);
	}

	private createPipeInputs(children: Scheme[], parentPath: string) {
		const obs = children.map((c, i) => this.createPipeInput(c, parentPath, i));
		return combineLatest(...obs);
	}

	private createPipeInput(child: Scheme, parentPath: string, order: number): Observable<PipeInput> {
		return async()
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
						return async(input);
					}
					return this.createPipeInputs(child.children, input.path + '.')
						.pipe(
							tap(childrenInputs => {
								input.children = childrenInputs;
							}),
							map(() => {
								return input;
							})
						);
				}),
				mergeMap(input => {
					return this.mongoDbProcessesPipes.insertOne(input)
						.pipe(
							map(() => input)
						);
				})
			);
	}

	createScheme(scheme: PipeInput) {
		return this.mongoDbProcesses.insertOne(scheme);
	}

	saveScheme(scheme: PipeInput) {
		const update = {
			$set: scheme
		};
		return this.mongoDbProcesses.updateOne(
			{
				_id: ObjectId(scheme.id)
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