const express = require('express');

import { ObjectId } from 'mongodb';

import { MongoDb } from './../shared/db';

import { combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

// import { ProductDto } from '@magz/common';

export class ProductsRouting {
	private collection = 'aggregated-products2';
	// private collection = 'products';
	private path = '/products';
	private router = express.Router();

	constructor() {
		this.router.get(this.path, (req, res, next) => {
			this.list(req.query || {})
				.subscribe(d => {
					res.status(200).json(d);
				});
		});
		this.router.get(this.path + '/:unitCode', (req, res, next) => {
			const unitCode = req.params.unitCode;
			this.get(unitCode)
				.subscribe(d => {
					res.status(200).json(d);
				});
		});
	}

	getRouter() {
		return this.router;
	}

	private get(unitCode: string) {
		return new MongoDb(this.collection).findOne({
			readableName: unitCode
		});
	}

	private list(queries: any) {
		const productsQueries: any = {
			// visible: true,
			items: {
				$elemMatch: {
					available: true
				}
			}
		};
		if (queries.exclude) {
			queries.exclude = Array.isArray(queries.exclude) ? queries.exclude: [queries.exclude];
			productsQueries.readableName = {
				$nin: queries.exclude
			}
		}
		if (queries.categories) {
			productsQueries.categories = {
				$elemMatch: {
					code: {
						$in: Array.isArray(queries.categories) ? queries.categories : [queries.categories]
					}
				}
			};
		}
		if (queries.or) {
			productsQueries.$or = [];
			if (queries.markets) {
				productsQueries.$or.push({
					items: {
						$elemMatch: {
							market: {
								code: {
									$in: Array.isArray(queries.markets) ? queries.markets : [queries.markets]
								}
							}
						}
					}
				});
			}
			if (queries.line) {
				productsQueries.$or.push({
					productLine: {
						code: {
							$in: Array.isArray(queries.line) ? queries.line : [queries.line]
						}
					}
				});
			}
			if (queries.company) {
				productsQueries.$or.push({
					'company.code': {
						$in: Array.isArray(queries.company) ? queries.company : [queries.company]
					}
				});
			}
			if (queries.search) {
				// productsQueries.$text = {
				// 	$search: queries.search.trim()
				// }
				productsQueries.$or.push({
					search: {
						$regex: new RegExp(queries.search.trim(), 'i')
					}
				});
			}
			if (queries.attributes) {
				productsQueries.$or.push({
					items: {
						$elemMatch: {
							productAttributes: {
								$elemMatch: {
									code: {
										$in: Array.isArray(queries.attributes) ? queries.attributes : [queries.attributes]
									}
								}
							}
						}
					}
				});
			}
		} else {
			if (queries.search) {
				// productsQueries.$text = {
				// 	$search: queries.search.trim()
				// }
				productsQueries.search = {
					$regex: new RegExp(queries.search.trim(), 'i')
				}
			}
			if (queries.markets) {
				productsQueries.items.$elemMatch['market.code'] = {
					$in: Array.isArray(queries.markets) ? queries.markets : [queries.markets]
				};
			}
			if (queries.line) {
				productsQueries['productLine.code'] = {
					$in: Array.isArray(queries.line) ? queries.line : [queries.line]
				};
			}
			if (queries.company) {
				productsQueries['company.code'] = {
					$in: Array.isArray(queries.company) ? queries.company : [queries.company]
				};
			}
			if (queries.attributes) {
				productsQueries.items.$elemMatch.productAttributes = {
					$elemMatch: {
						code: {
							$in: Array.isArray(queries.attributes) ? queries.attributes : [queries.attributes]
						}
					}
				};
			}
		}
		const markets = queries.markets ? Array.isArray(queries.markets) ? queries.markets : [queries.markets]: null;
			
		const page = +queries.page || 0;
		const itemsPerPage = +queries.itemsPerPage || 10;

		const countSubj = new MongoDb(this.collection).count(productsQueries);
		const productsSubj = new MongoDb(this.collection).aggregate(
			[
				{
					$match: productsQueries
				},
				...(() => {
					if (queries.or && queries.search) {
						return [{ $sort: { name: 1 } }];
					}
					return []
				})(),
				{
					$skip: (itemsPerPage * page)
				},
				{
					$limit: itemsPerPage
				},
				{
					$project: {
						name: 1,
						readableName: 1,
						logo: 1,
						company: 1,
						seo: 1,
						productLine: 1,
						categories: 1,
						reviews: 1,
						reviewsRating: 1,
						items: {
							// $in: [Array.isArray(queries.attributes) ? queries.attributes : [queries.attributes], '$$item.productAttributes.code']
							// $elemMatch: {
							// 	productAttributes: {
							// 		code: {
							// 			$in: Array.isArray(queries.attributes) ? queries.attributes : [queries.attributes]
							// 		}
							// 	}
							// },
							// ,
							$filter: {
								input: '$items',
								as: 'item',
								cond: {
									// $let: {
									// 	vars: {
									// 		available: '$$item.available',
									// 		codes: {
									// 			$map: {
									// 				input: "$item.productAttributes",
									// 				as: "attr",
									// 				in: '$$attr.code'
									// 			}
									// 		}
									// 	},
									// 	in: {
									// 		$and: [
									// 			// {
									// 			// 	$eq: ['$$available', true]
									// 			// }
									// 			// ,
									// 			{
									// 				$in: ['$$codes', ['100G']]
									// 			}
									// 		]
									// 	}
									// }
									$and: 
										(() => {
											const h: any[] = [
												{
													$eq: ['$$item.available', true]
												}
											];
											if(markets) {
												h.push({
													$in: ['$$item.market.code', markets]
												});
											}
											// h.push({
											// 	$eq: ['$$item.productAttributes.code', '100G']
											// });

											return h;
										})()
									// [
										
									// 	{
									// 		$eq: ['$$item.available', true]
									// 	},
									// 	{

									// 	}
									// 	// ,
									// 	// {
									// 	// 	$eq: ['$$item.productAttributes.code', '100G']
									// 	// }
									// ]
								}


								// productsQueries.items.$elemMatch.productAttributes = {
								// 	$elemMatch: {
								// 		code: {
								// 			$in: Array.isArray(queries.attributes) ? queries.attributes : [queries.attributes]
								// 		}
								// 	}
								// };
							}
						}
					}
				}
			]
		);

		console.log(JSON.stringify(productsQueries));
		let attributes: any = [];
		if (queries.attributes) {
			attributes = Array.isArray(queries.attributes) ? queries.attributes : [queries.attributes];
		}
		return combineLatest(countSubj, productsSubj)
			.pipe(
				map(d => {
					const count = d[0];
					const products = d[1]
						.map(p => {
							if (attributes && attributes.length) {
								p.items = p.items.filter(i => {
									// return i;
									return i.productAttributes.some(attr => {
										return attributes.includes(attr.code);
									});
								});
							}

							return p;
						});
					return {
						total: count,
						items: products
					};
				})
			);
	}

	private list2(queries: any) {
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
			if (!list.length) {
				subj.next({
					total: 0,
					items: []
				});
				subj.complete();
				return;
			}
			const ids = list.map(i => i.product);
			// productsQueries._id = {
			// 	$in: ids
			// };
			console.log(ids.length);
			console.log(ids.filter(d => !!d).length);

			const page = +queries.page || 0;
			const itemsPerPage = +queries.itemsPerPage || 10;

			// if (queries.search) {
			// 	productsQueries.name = {
			// 		$regex:  new RegExp(queries.search, 'i')
			// 	};
			// }

			this.findProductsIds(queries.search, ids)
				.subscribe(l => {
					const productsIds = l;
					console.log(productsIds.length, '=');

					if(queries.search) {
						productsQueries._id = {
							$in: productsIds.map(i => ObjectId(i)) || []
						};
					} else {
						productsQueries._id = {
							$in: ids.map(i => ObjectId(i)) || []
						};
					}

					const countSubj = new MongoDb(this.collection).count(productsQueries);
					const productsSubj = new MongoDb(this.collection).aggregate(
						[
							{
								$match: productsQueries
							},
							{
								$addFields: {
									// "__order2": {
									// 	$trim: "$_id"
									// },
									"__order": {
										$indexOfArray: [
											productsIds.map(i => ObjectId(i)), "$_id"
										]
									}
								}
							},
							{
								$sort: {"__order": 1}
							},
							{
								$skip: (itemsPerPage * page)
							},
							{
								$limit: itemsPerPage
							}
						]
					);

					console.log((itemsPerPage * page));

					combineLatest(countSubj, productsSubj).subscribe(d => {
						const count = d[0];
						const products = d[1];
						// console.log(products[0]);
						// console.log(productsIds.indexOf(products[0].__order2.toString()));
						const plist = products
							// .map(i => new ProductDto(i))
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
			// const countSubj = new MongoDb(this.collection).count(productsQueries);
			// const productsSubj = new MongoDb(this.collection).find(productsQueries, null, itemsPerPage, (itemsPerPage * page));
			// combineLatest(countSubj, productsSubj)
			// 	.subscribe(l => {
			// 		const count = l[0];
			// 		const products = l[1];
			// 		const plist = products
			// 			.map(i => new ProductDto(i))
			// 			.map(i => {
			// 				const related = list.filter(mp => mp.product === i._id.toString());
			// 				i.items = related;
			// 				return i;
			// 			});
			// 		subj.next({
			// 			total: count,
			// 			items: plist
			// 		});
			// 		subj.complete();
			// 	});
		});
		return subj;
	}

	private findProductsIds(query: string, allowedIds: string[]) {
		// const queries: any = {
		// 	query: {
		// 		$regex:  new RegExp(query, 'i')
		// 	}
		// }
		const queries: any = {
			$text: {
				$search: query
			}
		}
		if (allowedIds) {
			queries.product = {
				$in: allowedIds || []
			}
		}
		// console.log(queries);
		return new MongoDb('products-search').findSort(queries)
			.pipe(
				map(r => {
					// console.log(r);
					return r.map(p => p.product);
				})
			);
	}
}
