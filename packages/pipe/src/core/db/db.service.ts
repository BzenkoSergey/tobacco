import { DBType } from './db-type.enum';
import { DBManager } from './db.manager';
import { DBBase } from './db-base.abstract';
import { DBQueries } from './db-queries.type';
import { DBUpdate } from './db-update.type';
import { DBData } from './db-data.type';

export class DB {
	db: DBBase;

	constructor(table?: string, type = DBType.MYSQL) {
		this.db = DBManager.create(type, table);
	}

	createId(id?: string) {
		return this.db.createId(id);
	}

	update<T extends DBData>(id: any, update: DBUpdate<T>, queries?: DBQueries) {
		if (!queries) {
			queries = {
				query: {}
			};
		}
		queries.query.id = this.db.createId(id);
		update.$set = this.fixDta(update.$set);
		return this.db.updateOne(queries, update);
	}

	create<T extends DBData>(id: any, data: T) {
		data.id = this.db.createId(id);
		data = this.fixDta<T>(data);
		return this.db.insertOne(data);
	}

	list<T>(queries: DBQueries) {
		return this.db.find<T>(queries);
	}

	get<T>(id: string) {
		const queries = {
			query: {
				id: this.db.createId(id)
			}
		};
		return this.db.findOne<T>(queries);
	}

	private fixDta<T>(d: T) {
		const data = {} as T;

		Object.keys(d)
			.filter(prop => prop !== 'children')
			.forEach(prop => {
				data[prop] = d[prop];
			});
		
		// @ts-ignore
		if (typeof data.services === 'string') {
			// @ts-ignore
			data.services = data.services.split(',');
		}
		
		// @ts-ignore
		if (data['process.createdTime']) {
			// @ts-ignore
			data['process.createdTime'] = data['process.createdTime'] ? data['process.createdTime'].toString() : '';
		}

		// @ts-ignore
		if (data['process.startDate']) {
			// @ts-ignore
			data['process.startDate'] = data['process.startDate'] ? data['process.startDate'].toString() : '';
		}

		// @ts-ignore
		if (data['process.endDate']) {
			// @ts-ignore
			data['process.endDate'] = data['process.endDate'] ? data['process.endDate'].toString() : '';
		}

		// @ts-ignore
		if(data.process) {
			// @ts-ignore
			data.process.createdTime = data.process.createdTime ? data.process.createdTime.toString() : '';
			// @ts-ignore
			data.process.startDate = data.process.startDate ? data.process.startDate.toString() : '';
			// @ts-ignore
			data.process.endDate = data.process.endDate ? data.process.endDate.toString() : '';
		}

		// @ts-ignore
		if (data.config && typeof data.config !== 'string') {
			// @ts-ignore
			data.config = JSON.stringify(data.config);
		}
		// @ts-ignore
		return data;
	}
}