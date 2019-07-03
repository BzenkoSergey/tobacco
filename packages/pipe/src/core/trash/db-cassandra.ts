import { Subject } from 'rxjs';
import  * as cassandra from "cassandra-driver";

export class CassandraDb {
	// private table = 'scheme_processes_pipe';
	private Uuid = cassandra.types.Uuid;
	private client = new cassandra.Client({
		contactPoints: ['127.0.0.1:9042'],
		localDataCenter: 'datacenter1',
		keyspace: 'tobacco'
	});
	private table = '';

	constructor(
		table: string,
		isolated = false,
		url?: string,
		dbName?: string
	) {
		this.table = table || 'scheme_processes_pipe12';
	}

	updateOne(filter: Object, update: any, subj?: Subject<cassandra.types.ResultSet>): Subject<cassandra.types.ResultSet> {
		// console.log('CassandraDb->updateOne');
		subj = subj || new Subject<cassandra.types.ResultSet>();
		
		const sets = [];
		const where = [];
		const values = [];

		update = this.fixPipe(update.$set);
		Object.keys(update).forEach(prop => {
			sets.push('"' + prop + '" = ?');
			values.push(update[prop]);
		})
		Object.keys(filter).forEach(prop => {
			let value = filter[prop];
			if (prop === '_id') {
				prop = 'id';
			}
			where.push('"' + prop + '"' + ' = ?');
			if (value === undefined) {
				value = '';
			}
			values.push(value);
		})

		const cql = 'UPDATE ' + this.table + ' SET ' + sets.join(', ') + ' WHERE ' + where.join(' AND '); 

		// Set the prepare flag in the query options
		this.client.execute(cql, values, { prepare: true }, (err, result) => {
			if (err) {
				console.log(values);
				if (this.needRetry(err)) {
					this.updateOne(filter, {  $set: update }, subj)
					return;
				}
				subj.error(err);
				return;
			}
			subj.next(result);
			subj.complete();
		});
		return subj;
	}

	findOne(query: any, subj?: Subject<any>): Subject<any> {
		// console.log('CassandraDb->findOne');
		subj = subj || new Subject<any>();

		const where = [];
		const whereValues = [];
		Object.keys(query).forEach(prop => {
			where.push(prop + ' = ?');
			whereValues.push(query[prop]);
		})
		const cql = 'SELECT JSON * FROM ' + this.table + ' WHERE ' + where.join(' AND ');
		this.client.execute(cql, whereValues, (err, result) => {
			if (err) {
				if (this.needRetry(err)) {
					this.findOne(query, subj)
					return;
				}
				subj.error(err);
				return;
			}
			subj.next(result);
			subj.complete();
		});
		return subj;
	}

	find(query: Object, subj?: Subject<any>): Subject<any> {
		// console.log('CassandraDb->find');
		subj = subj || new Subject<any>();

		const where = [];
		const whereValues = [];
		Object.keys(query).forEach(prop => {
			const value = query[prop];
			if (value === 'NOT_NULL') {
				where.push('"' + prop + '" > ?');
				whereValues.push('');
				return;
			}
			if (value === null) {
				where.push('"' + prop + '" = ?');
				whereValues.push('');
				return;
			}
			where.push('"' + prop + '" = ?');
			whereValues.push(query[prop]);
		})
		// console.log(whereValues);
		const cql = 'SELECT * FROM ' + this.table + ' WHERE ' + where.join(' AND ');
		// console.log(cql);
		this.client.execute(cql, whereValues, (err, result) => {
			if (err) {
				if (this.needRetry(err)) {
					this.find(query, subj)
					return;
				}
				subj.error(err);
				return;
			}
			subj.next(result.rows);
			subj.complete();
		});

		return subj;
	}

	insertOne(docs: Object, subj?: Subject<{insertedId: string}>): Subject<{insertedId: string}> {
		// console.log('CassandraDb->insertOne');
		docs = this.fixPipe(docs);
		subj = subj || new Subject<{insertedId: string}>();

		const props = Object.keys(docs);

		const keys = [];
		const values = [];

		let idIndex = props.indexOf('id');
		if (!~idIndex) {
			keys.push('"id"');
			values.push(this.Uuid.random());
			idIndex = 0;
		}

		props.forEach(prop => {
			keys.push('"' + prop + '"');
			values.push(docs[prop]);
		})

		const cql = 'INSERT INTO ' + this.table + ' (' + keys.join(', ') + ') VALUES (' + values.map(() => '?').join(', ') + ')'; 
	
		// Set the prepare flag in the query options
		this.client.execute(cql, values, { prepare: true }, (err, result) => {
			if (err) {
				if (this.needRetry(err)) {
					this.insertOne(docs, subj)
					return;
				}
				subj.error(err);
				return;
			}
			subj.next({
				insertedId: values[idIndex].toString()
			});
			subj.complete();
		});
		return subj;
	}

	private fixPipe(pipe: any) {
		const obj: any = {};
		Object.keys(pipe).forEach(prop => {
			if (prop === 'process') {
				return;
			}
			if (prop === 'children') {
				return;
			}
			if (prop === 'process.startDate') {
				obj['processStartDate'] = pipe[prop].toString();
				return;
			}
			if (prop === 'process.status') {
				obj['processStatus'] = pipe[prop];
				return;
			}
			if (prop === 'process.createdTime') {
				obj['processCreatedTime'] = pipe[prop].toString();
				return;
			}
			if (prop === 'process.endDate') {
				obj['processEndDate'] = pipe[prop].toString();
				return;
			}
			if (prop === 'process.input') {
				obj['processInput'] = pipe[prop];
				return;
			}
			if (prop === 'process.error') {
				obj['processError'] = pipe[prop];
				return;
			}
			if (prop === 'process.output') {
				obj['processOutput'] = pipe[prop];
				return;
			}
			if (prop === '_id') {
				obj['id'] = pipe[prop].toString();
				return;
			}
			if (prop === 'config') {
				obj['config'] = JSON.stringify(pipe[prop]);
				return;
			}
			if (prop === 'input') {
				obj['input'] = JSON.stringify(pipe[prop]);
				return;
			}

			let value = pipe[prop];
			if (value === undefined) {
				value = '';
			}
			obj[prop] = value;
		})
		if (pipe.process) {
			obj.processCreatedTime = pipe.process.createdTime ? pipe.process.createdTime.toString() : pipe.process.createdTime;
			obj.processStartDate = pipe.process.startDate ? pipe.process.startDate.toString() : pipe.process.startDate;
			obj.processEndDate = pipe.process.endDate ? pipe.process.endDate.toString() : pipe.process.endDate;
			obj.processError = pipe.process.error;
			obj.processStatus = pipe.process.status;
			obj.processInput = pipe.process.input;
			obj.processOutput = pipe.process.output;
		}
		return obj;
	}

	private needRetry(err: any) {
		console.warn(err);
		return !!~err.message.indexOf('failed to connect to server ');
	}
}