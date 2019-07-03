import { DBType } from './db-type.enum';

import { DBBase } from './db-base.abstract';
import { DBCassandra } from './cassandra/cassandra';
import { DBMongo } from './mongo/mongo';
import { DBMySql } from './mysql/mysql';

export class DBManager {
	static create(type: DBType, table: string, url?: string, isolated?: boolean, dbName?: string, port?: number): DBBase {
		if (type === DBType.CASSANDRA) {
			return new DBCassandra(table, url);
		}
		if (type === DBType.MYSQL) {
			return new DBMySql(table, url, port);
		}
		return new DBMongo(table, url, isolated, dbName);
	}
}