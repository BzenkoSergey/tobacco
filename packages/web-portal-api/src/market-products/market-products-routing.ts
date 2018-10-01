const express = require('express');
import { MongoDb } from './../shared/db';

import { map } from 'rxjs/operators';

import { MarketProductDto } from '@magz/common';

export class MarketProductsRouting {
	private collection = 'market-products';
	private path = '/market-products';
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
					return list.map(i => new MarketProductDto(i));
				})
			);
	}
}