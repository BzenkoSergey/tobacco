const express = require('express');
import { MongoDb } from './../shared/db';

import { map } from 'rxjs/operators';

import { ProductLineDto } from '@magz/common';

export class ProductLinesRouting {
	private collection = 'product-lines';
	private path = '/product-lines';
	private router = express.Router();

	constructor() {
		this.router.get(this.path, (req, res, next) => {
			this.list()
				.subscribe(d => {
					res.status(200).json(d);
				});
		});
	}

	getRouter() {
		return this.router;
	}

	private list() {
		return new MongoDb(this.collection).find({})
			.pipe(
				map(list => {
					return list.map(i => new ProductLineDto(i));
				})
			);
	}
}