const express = require('express');

import { Subject } from 'rxjs';

import { MongoDb } from './../shared/db';

type SearchQueriesDto = {
	query: string;
}

export class SearchRouting {
	private collection = 'search';
	private path = '/search';
	private router = express.Router();

	constructor() {
		this.router.get(this.path, (req, res) => {
			this.list(req.query || {})
				.subscribe(d => {
					res.status(200).json(d);
				});
		});

		this.router.post(this.path, (req, res) => {
			this.create(req.body || {})
				.subscribe(d => {
					res.status(200).json(d);
				});
		});
	}

	getRouter() {
		return this.router;
	}

	private create(body: SearchQueriesDto) {
		const subj = new Subject<SearchQueriesDto>();
		this.list(body)
			.subscribe(d => {
				if(d.length) {
					subj.next({ query: '' });
					subj.complete();
					return;
				}
				new MongoDb(this.collection).insertOne(body)
					.subscribe(r => {
						subj.next(r);
						subj.complete();
					});
			});

		return subj;
	}

	private list(queries: SearchQueriesDto): Subject<SearchQueriesDto[]> {
		const mongoQueries = {
			query: {
				$regex:  new RegExp(queries.query, 'i')
			}
		};
		
		// console.log(mongoQueries);
		return new MongoDb(this.collection).find(mongoQueries, null, 10, 0);
	}
}