import { Subject } from 'rxjs';
import  * as mysql from 'mysql';
import  * as uuidv4 from 'uuid/v4';

import { DBBase } from '../db-base.abstract';
import { DBQueries } from './../db-queries.type';
import { DBUpdate } from './../db-update.type';
import { DBCassandraQueriesTransform } from './queries-transform';
import { DBCassandraDataTransform } from './data-transform';

const map = new Map<string, mysql.IPool>();

export class DBMySql extends DBBase {
	private client: mysql.IPool;

	protected queriesTransform: DBCassandraQueriesTransform;
	protected dataTransform: DBCassandraDataTransform;

	constructor(
		protected table = 'scheme_processes_pipe',
		url = '192.168.0.181',
		port = 3306
	) {
		super(table);

		this.queriesTransform = new DBCassandraQueriesTransform(this.table);
		this.dataTransform = new DBCassandraDataTransform();

		this.client = map.get(this.table) || mysql.createPool({
			host: url,
			port: port,
			user: 'bz',
			password: '061090spd_-S',
			database: 'tobacco'
		
			// host: '176.111.49.29',
			// port: 3306,
			// user: 'flnisoxk_magz',
			// password: 'spd061090',
			// database: 'flnisoxk_magz'
			,
		
			multipleStatements: true,
			connectTimeout: 10000,
			connectionLimit: 9999999
		});
		map.set(this.table, this.client);
	}

	createId(id?: string) {
		if (id) {
			return id;
		}
		return uuidv4().toString();
	}

	updateOne<T>(queries: DBQueries, update: DBUpdate<T>, subj?: Subject<never>) {
		subj = subj || new Subject<never>();
		
		const sets = [];
		const where = [];
		const values = [];

		const toUpdate = this.dataTransform.toDb(update.$set);

		Object.keys(toUpdate).forEach(prop => {
			// sets.push('"' + prop + '" = ?');
			sets.push(prop + ' = ?');
			values.push(toUpdate[prop]);
		})
		Object.keys(queries.query).forEach(prop => {
			let value = queries.query[prop];
			if (prop === '_id') {
				prop = 'id';
			}
			// where.push('"' + prop + '"' + ' = ?');
			where.push(prop + ' = ?');
			if (value === undefined) {
				value = '';
			}
			if (Array.isArray(value)) {
				value = value.join(',');
			}
			values.push(value);
		})

		const cql = 'UPDATE ' + this.table + ' SET ' + sets.join(', ') + ' WHERE ' + where.join(' AND '); 

		// Set the prepare flag in the query options
		this.client.getConnection((err, connection) => {
			if (err) {
				subj.error(err);
				return;
			}
			connection.query(cql, values, err => {
				connection.release();
				if (err) {
					if (this.needRetry(err)) {
						this.updateOne(queries, update, subj)
						return;
					}
					subj.error(err);
					return;
				}
				subj.next();
				subj.complete();
			});
		})

		return subj.asObservable();
	}

	findOne<T>(queries: DBQueries, subj?: Subject<T>) {
		// console.log('CassandraDb->findOne');
		subj = subj || new Subject<any>();

		const q = this.queriesTransform.get(queries);

		this.client.getConnection((err, connection) => {
			if (err) {
				subj.error(err);
				return;
			}
			connection.query(q[0], q[1], (err, result) => {
				connection.release();
				if (err) {
					if (this.needRetry(err)) {
						this.findOne(queries, subj)
						return;
					}
					subj.error(err);
					return;
				}
	
				// @ts-ignore
				const item = result[0] as T;
				const response = this.dataTransform.fromDb(item);
	
				subj.next(response);
				subj.complete();
			});
		});
		return subj.asObservable();
	}

	find<T>(queries: DBQueries, subj?: Subject<T[]>) {
		// console.log('CassandraDb->find');
		subj = subj || new Subject<T[]>();

		const q = this.queriesTransform.get(queries);

		this.client.getConnection((err, connection) => {
			if (err) {
				subj.error(err);
				return;
			}
			connection.query(q[0], q[1], (err, result) => {
				connection.release();
				if (err) {
					if (this.needRetry(err)) {
						this.find(queries, subj)
						return;
					}
					subj.error(err);
					return;
				}
				// @ts-ignore
				const items = result as T[];
				const response = items.map(i => {
					return this.dataTransform.fromDb(i);
				})
	
				subj.next(response);
				subj.complete();
			});
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
			values.push(this.createId());
			idIndex = 0;
		}

		props.forEach(prop => {
			keys.push(prop);
			// keys.push('"' + prop + '"');
			let d = docToSave[prop];
			if (Array.isArray(d)) {
				d = d.join(',');
			}
			values.push(d);
		})

		const cql = 'INSERT INTO ' + this.table + ' (' + keys.join(', ') + ') VALUES (' + values.map(() => '?').join(', ') + ')'; 
	
		// Set the prepare flag in the query options
		this.client.getConnection((err, connection) => {
			if (err) {
				subj.error(err);
				return;
			}
			connection.query(cql, values, err => {
				connection.release();
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
		});
		return subj.asObservable();
	}

	private needRetry(err: any) {
		console.warn(err);
		return !!~err.message.indexOf('failed to connect to server ');
	}
}