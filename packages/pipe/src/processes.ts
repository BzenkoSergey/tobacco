import { mergeMap, map } from 'rxjs/operators';

import { ObjectId } from 'mongodb';

import { async } from './async';
import { DB } from './core/db';

export class ProcessesJob {
	private map = new Map<any, any[]>();

	run(query: any) {
		return this.getList(query);
		// return this.getList(query)
		// 	.pipe(
		// 		mergeMap(list => {
		// 			if (!list.length) {
		// 				return async(list);
		// 			}
		// 			list.forEach(i => {
		// 				const parent = i.parent ? i.parent.toString() : null;
		// 				const f = this.map.get(parent) || [];
		// 				f.push(i);
		// 				this.map.set(parent, f);
		// 			});

		// 			const r = list
		// 				.filter(i => !i.parent)
		// 				.map(i => this.getTree(i));

		// 			return async(r);
		// 		})
		// 	);
	}

	private getTree(item: any) {
		item.children = this.map.get((item._id || item.id).toString()) || [];
		if (!item.children.length) {
			return item;
		}
		const boxChildren = item.children.length >= 6;
		item.children.forEach(i => {
			i.box = boxChildren;
			i.hide = item.box || item.hide;
			this.getTree(i);
		});
		return item;
	}

	private getList(queries: any) {
		const cas = new DB();

		// let cas = new DB('parent214');
		// if (queries.processId) {
		// 	cas = new DB('parent213');
		// }

		return cas
			.list<any>({
				query: this.processQueries(queries)
			})
			.pipe(map(i => {
				// console.log(i);
				return i;
			}));
	}


	private processQueries(obj: any, idMark = '$') {
		if (typeof obj === 'boolean') {
			return obj;
		}
		if (typeof obj === 'string') {
			if (obj.startsWith(idMark)) {
				return ObjectId(obj.replace(idMark, ''));
			}
			if (obj === 'null') {
				return '';
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