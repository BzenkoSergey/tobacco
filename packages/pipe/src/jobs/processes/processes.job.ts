import { from, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';

import { ObjectId } from 'mongodb';
import { MongoDb } from './../../core/trash/db';
import { CassandraDb } from '../../core/trash/db-cassandra';
import { MongoExtDb } from '../../core/trash/db-ext';

import { async } from './../../async';
import { PipeInjector } from '../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { ExtService } from '../../core/services/ext.service';
import { DB } from './../../core/db';

const cache = new Map<string, any>();

export class ProcessesJob implements Job {
	private options: any;
	private messager: Messager;
	private di: DI;
	private pipePath: string;
	private map = new Map<any, any[]>();

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
		this.messager = messager;
	}

	setSchemeId(schemeId: string) {
		return this;
	}

	setStaticOptions(options: any) {
		return this;
	}

	setDI(di: DI) {
		this.di = di;
		return this;
	}

	setPipePath(path: string) {
		this.pipePath = path;
		return this;
	}

	run(query: any) {
		const a = Date.now();
		// console.log('start', this.processQueries(query));

		return this.getList(query)
			.pipe(
				mergeMap(list => {
					if (!list.length) {
						return async(list);
					}
					list.forEach(i => {
						// i.process = {
						// 	input: i.processInput,
						// 	output: i.processOutput,
						// 	startDate: i.processStartDate,
						// 	status: i.processStatus,
						// 	endDate: i.processEndDate,
						// 	createdTime: i.processCreatedTime,
						// }
						const parent = i.parent ? i.parent.toString() : null;
						const f = this.map.get(parent) || [];
						f.push(i);
						this.map.set(parent, f);
					});


					const r = list
						.filter(i => !i.parent)
						.map(i => this.getTree(i));

					return async(r);
					// const subjs = list.map(i => this.genOne(i));
					// return combineLatest(...subjs);
				})
			);
	}

	destroy() {
		return this;
	}

	private getTree(item: any) {
		item.children = this.map.get((item._id || item.id).toString()) || [];
		if (!item.children.length) {
			return item;
		}
		item.children.forEach(i => this.getTree(i));
		return item;
	}

	private getList(queries: any) {
		// if (!queries.processId) {
		// 	queries.processId = 'NOT_NULL';
		// }
		let cas = new DB('parent214');
		if (queries.processId) {
			cas = new DB('parent213');
		}
		return cas
			.list<any>({
				query: this.processQueries(queries)
			})
			.pipe(map(i => {
				// console.log(i);
				return i;
			}));
		// return new MongoDb('scheme-processes-pipe', true)
		// 	.find(this.processQueries(queries));
	}

	// private genOne(process: any) {
	// 	return this.fetchPipes((process._id || process.id).toString())
	// 		.pipe(
	// 			map(pipes => {
	// 				const map = new Map();
	// 				pipes.forEach(i => {
	// 					map.set((i._id || i.id).toString(), i);
	// 				});

	// 				const i = this.genChildren(process, map);
	// 				// i._id = process._id;
	// 				i.id = process.id;
	// 				return i;
	// 			})
	// 		);
	// }

	// private genChildren(process: any, pipes: Map<string, any>) {
	// 	if (!process.id) {
	// 		return {};
	// 	}
	// 	const id = process.id.toString();
	// 	const pipe = pipes.get(id);
	// 	if (!pipe) {
	// 		return {};
	// 	}
	// 	if (process.children.length) {
	// 		pipe.children = process.children
	// 			.filter(i => !!i)
	// 			.map(c => this.genChildren(c, pipes))
	// 			.filter(i => !!i);
	// 	}
	// 	return pipe;
	// }

	// private fetchPipes(processId: string) {
	// 	return new MongoDb('scheme-processes-pipe', true)
	// 		.find({
	// 			processId: processId
	// 		});
	// }

	// private getIds(process: any) {
	// 	if (!process) {
	// 		// happend when proces in progrress of db filling
	// 		return [];
	// 	}
	// 	let ids = [process.id];
	// 	if (process.children) {
	// 		const ciDS = process.children.map(c => this.getIds(c));
	// 		ids = ids.concat(...ciDS);
	// 	}
	// 	return ids;
	// }

	private processQueries(obj: any, idMark = '$') {
		if (typeof obj === 'boolean') {
			return obj;
		}
		if (typeof obj === 'string') {
			if (obj.startsWith(idMark)) {
				return ObjectId(obj.replace(idMark, ''));
			}
			return obj;
		}
		if (typeof obj === 'number') {
			return obj;
		}
		if (!obj) {
			return obj;
		}
		if (Array.isArray(obj)) {
			return obj.map(i => this.processQueries(i, idMark));
		}
		const o: any = {};
		Object.keys(obj)
			.forEach(p => {
				o[p] = this.processQueries(obj[p], idMark);
			});
		return o;
	}
}