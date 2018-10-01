const express = require('express');
import { MongoDb } from './../shared/db';

import { map } from 'rxjs/operators';

import { ProductAttributeDto } from '@magz/common';

export class ProductAttributesRouting {
	private collection = 'product-attributes';
	private path = '/product-attributes';
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
					return list.map(i => new ProductAttributeDto(i));
				})
			);
	}
}