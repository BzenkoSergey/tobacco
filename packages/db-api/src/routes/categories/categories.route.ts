const express = require('express');
import { ObjectId } from 'mongodb';
import { MongoDb } from './../../core/db';

import { map } from 'rxjs/operators';

import { CategoryDto } from '@magz/common';

export class CategoriesRoute {
	private collection = 'categories';
	private path = '/categories';
	private router = express.Router();

	constructor() {
		this.router.get(this.path, (req, res, next) => {
			this.list(req.query)
				.subscribe(d => {
					res.status(200).json(d);
				});
		});

		this.router.post(this.path, (req, res) => {
			this.create(req.body)
				.subscribe(d => {
					res.status(200).json(d);
				});
		});

		this.router.put(this.path + '/:id', (req, res) => {
			this.update(req.params.jobId, req.body)
				.subscribe(d => {
					res.status(200).json(d);
				});
		});

		this.router.delete(this.path + '/:id', (req, res) => {
			this.delete(req.params.jobId)
				.subscribe(d => {
					res.status(200).json(d);
				});
		});
	}

	getRouter() {
		return this.router;
	}

	private delete(id: string) {
		return new MongoDb(this.collection)
			.remove({
				_id: ObjectId(id)
			});
	}

	private update(id: string, d: CategoryDto) {
		return new MongoDb(this.collection)
			.updateOne(
				{
					_id: ObjectId(id)
				},
				d
			)
			.pipe(
				map(list => {
					return list.map(i => new CategoryDto(i));
				})
			);
	}

	private create(d: CategoryDto) {
		return new MongoDb(this.collection).insertOne(d)
			.pipe(
				map(list => {
					return list.map(i => new CategoryDto(i));
				})
			);
	}

	private list(query: Object|null) {
		return new MongoDb(this.collection).find(query || {})
			.pipe(
				map(list => {
					return list.map(i => new CategoryDto(i));
				})
			);
	}
}