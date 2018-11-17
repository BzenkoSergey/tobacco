const express = require('express');
import { MongoDb } from './../../core/db';

import { map } from 'rxjs/operators';

import { CategoryDto } from '@magz/common';

export class CompaniesRoute {
	private collection = 'companies';
	private path = '/companies';
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
					return list.map(i => new CategoryDto(i));
				})
			);
	}
}