import { Subject } from 'rxjs';
import  * as cassandra from 'cassandra-driver';

import { DBBase } from '../db-base.abstract';
import { DBQueries } from './../db-queries.type';
import { DBUpdate } from './../db-update.type';
import { DBCassandraQueriesTransform } from './queries-transform';
import { DBCassandraDataTransform } from './data-transform';

export class DBCassandra extends DBBase {
	private Uuid = cassandra.types.Uuid;
	private client: cassandra.Client;

	protected queriesTransform: DBCassandraQueriesTransform;
	protected dataTransform: DBCassandraDataTransform;

	constructor(
		protected table = 'scheme_processes_pipe30',
		url = '127.0.0.1:9042'
	) {
		super(table);

		this.queriesTransform = new DBCassandraQueriesTransform(this.table);
		this.dataTransform = new DBCassandraDataTransform();

		this.client = new cassandra.Client({
			contactPoints: [url],
			localDataCenter: 'datacenter1',
			keyspace: 'tobacco'
		});
	}

	createId(id?: string) {
		if (id) {
			return id;
		}
		return this.Uuid.random().toString();
	}

	updateOne<T>(queries: DBQueries, update: DBUpdate<T>, subj?: Subject<never>) {
		subj = subj || new Subject<never>();
		
		const sets = [];
		const where = [];
		const values = [];

		const toUpdate = this.dataTransform.toDb(update.$set);

		Object.keys(toUpdate).forEach(prop => {
			sets.push('"' + prop + '" = ?');
			values.push(toUpdate[prop]);
		})
		Object.keys(queries.query).forEach(prop => {
			let value = queries.query[prop];
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

		// console.log('=================');
		// console.log(cql);
		// console.log(values);
		// debugger;
		// Set the prepare flag in the query options
		this.client.execute(cql, values, { prepare: true }, err => {
			if (err) {
				if (this.needRetry(err)) {
					this.updateOne(queries, update, subj)
					return;
				}
				console.log(update, toUpdate);
				subj.error(err);
				return;
			}
			subj.next();
			subj.complete();
		});
		return subj.asObservable();
	}

	findOne<T>(queries: DBQueries, subj?: Subject<T>) {
		// console.log('CassandraDb->findOne');
		subj = subj || new Subject<any>();

		const q = this.queriesTransform.get(queries);
		this.client.execute(q[0], q[1], (err, result) => {
			if (err) {
				if (this.needRetry(err)) {
					this.findOne(queries, subj)
					return;
				}
				subj.error(err);
				return;
			}

			// @ts-ignore
			const item = result.rows[0] as T;
			const response = this.dataTransform.fromDb(item);

			subj.next(response);
			subj.complete();
		});
		return subj.asObservable();
	}

	find<T>(queries: DBQueries, subj?: Subject<T[]>) {
		// console.log('CassandraDb->find');
		subj = subj || new Subject<T[]>();

		const q = this.queriesTransform.get(queries);
		this.client.execute(q[0], q[1], (err, result) => {
			if (err) {
				if (this.needRetry(err)) {
					this.find(queries, subj)
					return;
				}
				subj.error(err);
				return;
			}
			// @ts-ignore
			const items = result.rows as T[];
			const response = items.map(i => {
				return this.dataTransform.fromDb(i);
			})

			subj.next(response);
			subj.complete();
		});

		return subj.asObservable();
	}

	insertOne<T>(doc: T, subj?: Subject<{insertedId: string}>) {
		// console.log('CassandraDb->insertOne');
		const docToSave = this.dataTransform.toDb(doc);
		subj = subj || new Subject<{insertedId: string}>();

		const props = Object.keys(docToSave);

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
			values.push(docToSave[prop]);
		})

		const cql = 'INSERT INTO ' + this.table + ' (' + keys.join(', ') + ') VALUES (' + values.map(() => '?').join(', ') + ')'; 
	
		// Set the prepare flag in the query options
		this.client.execute(cql, values, { prepare: true }, err => {
			if (err) {
				if (this.needRetry(err)) {
					this.insertOne(docToSave, subj)
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
		return subj.asObservable();
	}

	private needRetry(err: any) {
		console.warn(err);
		return !!~err.message.indexOf('failed to connect to server ');
	}
}