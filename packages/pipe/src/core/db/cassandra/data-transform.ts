import  * as cassandra from 'cassandra-driver';

import { DBDataTransform } from './../db-data-transform';

export class DBCassandraDataTransform extends DBDataTransform {
	private divider = '_';

	fromDb(d: any) {
		const props = Object.keys(d);
		const result: any = {};

		props.forEach(prop => {
			const paths = this.getPaths(prop);
			const value = d[prop];
			this.setProperty(result, paths, value);
		});
		return result;
	}

	toDb(d: any, parentProp?: string) {
		const props = Object.keys(d);
		const result = {};

		props.forEach(prop => {
			let propName = (parentProp ? parentProp + this.divider : '') + prop;
			if (propName.includes('.')) {
				propName = propName.replace(/\./g, this.divider);
			}
			
			const value = d[prop];
			if (!!~['string', 'number', 'boolean'].indexOf(typeof value) || !value || Array.isArray(value)) {
				if (value === undefined) {
					result[propName] = '';
					return;
				}
				result[propName] = value;
				return;
			}
			if (value instanceof cassandra.types.Uuid) {
				result[propName] = value;
				return;
			}
			const nested = this.toDb(value, propName);
			Object
				.keys(nested)
				.forEach(prop => {
					result[prop] = nested[prop];
				})
		});
		return result;
	}

	private setProperty(obj: any, paths: string[], value: any) {
		let nested = obj;

		paths.forEach((segment, i) => {
			if (i === paths.length - 1 || paths.length === 1) {
				nested[segment] = value;
				return;
			}

			const nextNested = nested[segment];
			nested[segment] = nextNested || {};
			nested = nested[segment];
		});
	}

	private getPaths(column: string) {
		return column.split(this.divider);
	}
}