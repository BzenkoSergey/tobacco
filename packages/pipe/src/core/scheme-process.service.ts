import { ObjectId } from 'mongodb';
import { MongoDb } from './db';
import { async } from './../async';

export class SchemeProcessService {
	private db = new MongoDb('scheme-processes', true);
	private list: any[] = [];
	private running = false;
	private interval: any;

	constructor() {
		console.warn('SchemeProcessService');
	}

	update(schemeProcessId: string, d: any) {
		this.list.push({
			updateOne: {
				"filter": {
					_id: ObjectId(schemeProcessId)
				},
				"update": d
			}
		});

		if (!this.running && !this.interval) {
			this.interval = setTimeout(() => {
				this.interval = null;
				this.run();
			}, 1000);
		}
		return async(true);
	}

	private run() {
		this.running = true;

		const list = this.list;
		this.list = [];
		return this.db.bulkWrite(list)
			.subscribe(
				d => {
					this.running = false;
				},
				e => {
					this.running = false;
				}
			)
	}
}

// db.getCollection('test').update({_id:ObjectId("5c390f30b1e0d83310a5e6ed")}, { $set: {  
//     'children[2].children[2]': { children: [] }
// } })
// .bulkWrite([
// 	{
// 		updateOne: {
// 			"filter": {
// 				_id:ObjectId("5c390f30b1e0d83310a5e6ed")
// 			},
// 			"update": {
// 				$set : {
// 					'children.1': { children: [] }
// 				}
// 			}
// 		}
// 	},
// 	{
// 		updateOne: {
// 			"filter": {
// 				_id:ObjectId("5c390f30b1e0d83310a5e6ed")
// 			},
// 			"update": {
// 				$set : {
// 					'children.1.children.2': { children: [] }
// 				}
// 			}
// 		}
// 	}
// ]);