import { ObjectId } from 'mongodb';
import { combineLatest, of, Subject, throwError } from 'rxjs'
import { tap, mergeMap, catchError } from 'rxjs/operators';

import { MongoDb } from './../core/db';
import { PipeStatus} from './status.enum';
import { Identifier } from './identifier';

export interface ProcessBase {
	id: string,
	order: string,
	parentProcess?: string,
	status: PipeStatus,
	createdTime: number,
	startDate: number,
	endDate: number,
	error: string,
	input: any,
	output: any
}

export abstract class PipeBase<T extends ProcessBase> {
	protected mongoDb: MongoDb;
	protected abstract process: T;
	protected abstract id: string;
	protected abstract order: string;

	protected processes: T[] = [];

	abstract run(options: any): any;

	constructor(collectionName: string) {
		this.mongoDb = new MongoDb(collectionName);
	}

	getId() {
		return this.id;
	}

	destroy() {
		return this;
	}

	protected fetch() {
		return this.mongoDb.findOne({
			_id: ObjectId(this.id)
		});
	}

	protected update() {
		return this.mongoDb.updateOne(
			{
				_id: ObjectId(this.id),
				processes: {
					$elemMatch: {
						id: this.process.id,
						order: this.order
					}
				}
			},
			{
				$set: {
					'processes.$': this.process
				}
			}
		);
	}

	protected handleError(e) {
		try {
			if (!this.process) {
				console.log(this.id, this.order, this.processes);
			}
			this.process.endDate = Date.now();
			this.process.status = PipeStatus.ERROR;
			this.process.error = e.toString();
	
			return this.update()
				.pipe(
					mergeMap(() => throwError(e))
				);
		} catch(e) {
			return throwError(e);
		}
	}

	protected defineExistsProcess(parentProcessId: string) {
		this.process = this.processes.find(p => {
			return p.parentProcess === parentProcessId && this.order === p.order;
		});
		if(!this.process) {
			console.log(this.id);
			console.log(parentProcessId);
			console.log('ERRRRRRRRRRRRROR', this.order);
			console.log(this.processes);
		}
		return of(true);
	}

	protected saveProcess(process: T) {
		this.process = process;
		this.processes.push(this.process);

		return this.mongoDb.updateOne(
			{
				_id: ObjectId(this.id)
			},
			{
				$addToSet: {
					processes: this.process
				}
			}
		);
	}

	protected createProcess() {
		return {
			id: Identifier.generate(),
			createdTime: Date.now(),
			startDate: Date.now(),
			endDate: null,
			error: '',
			status: PipeStatus.PENDING,
			order: this.order
		};
	}
}