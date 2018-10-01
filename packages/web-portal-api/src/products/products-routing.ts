const express = require('express');

import { ObjectId } from 'mongodb';

import { MongoDb } from './../shared/db';

import { combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductDto } from '@magz/common';

export class ProductsRouting {
	private collection = 'products';
	private path = '/products';
	private router = express.Router();

	constructor() {
		this.router.get(this.path, (req, res, next) => {
			this.list(req.query || {})
				.subscribe(d => {
					res.status(200).json(d);
				});
		});
	}

	getRouter() {
		return this.router;
	}

	private list(queries: any) {
		const productsQueries: any = {};
		const marketProductsQueries: any = {
			available: true
		};
		if (queries.markets) {
			marketProductsQueries.market = {
				$in: Array.isArray(queries.markets) ? queries.markets : [queries.markets]
			}
		}
		if (queries.company) {
			productsQueries.company = {
				$in: Array.isArray(queries.company) ? queries.company : [queries.company]
			};
		}
		if (queries.categories) {
			productsQueries.categories = {
				$in: Array.isArray(queries.categories) ? queries.categories : [queries.categories]
			};
		}
		if (queries.attributes) {
			const g = Array.isArray(queries.attributes) ? queries.attributes : [queries.attributes];
			const list = g.map(s => {
				const f = s.split('-');
				const attributeId = f[0];
				const attributeValues = f[1].split('=');
				return attributeValues;
			});
			marketProductsQueries['attributes.value'] = {
				$in: [].concat.apply([], list)
			};
		}
		
		// const products = new MongoDb(this.collection).find(productsQueries);
		const marketProducts = new MongoDb('market-products').find(marketProductsQueries);

		const subj = new Subject();
		marketProducts.subscribe(list => {
			const ids = list.map(i => ObjectId(i.product));
			productsQueries._id = {
				$in: ids
			};

			const page = +queries.page || 0;
			const itemsPerPage = +queries.itemsPerPage || 10;
			console.log(page);
			console.log(itemsPerPage);
			console.log(itemsPerPage * page);

			const countSubj = new MongoDb(this.collection).count(productsQueries);
			const productsSubj = new MongoDb(this.collection).find(productsQueries, null, itemsPerPage, (itemsPerPage * page));
			combineLatest(countSubj, productsSubj)
				.subscribe(l => {
					const count = l[0];
					const products = l[1];
					const plist = products
						.map(i => new ProductDto(i))
						.map(i => {
							const related = list.filter(mp => mp.product === i._id.toString());
							i.items = related;
							return i;
						});
					subj.next({
						total: count,
						items: plist
					});
					subj.complete();
				});
		});
		return subj;
		// return combineLatest(products, marketProducts)
		// 	.pipe(
		// 		map(list => {
		// 			const products = list[0];
		// 			const marketProducts = list[1];
		// 			return products
		// 				.filter(p => {
		// 					const related = marketProducts.filter(mp => mp.product === p._id.toString())
		// 					if (!related.length) {
		// 						return false;
		// 					}
		// 					if (queries.available) {
		// 						return related.some(mp => {
		// 							return mp.available;
		// 						});
		// 					}
		// 					if (queries.available === false) {
		// 						return related.every(mp => {
		// 							return !mp.available;
		// 						});
		// 					}
		// 					return true;
		// 				})
		// 				.map(i => new ProductDto(i))
		// 				.map(i => {
		// 					const related = marketProducts
		// 						.filter(mp => mp.product === i._id.toString())
		// 						.filter(mp => mp.available);
		// 					i.items = related;
		// 					return i;
		// 				});
		// 		})
		// 	);
	}
}