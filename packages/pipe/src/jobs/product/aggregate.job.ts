import { from, Subject, BehaviorSubject, combineLatest, of } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';

import { ObjectId } from 'mongodb';
import { MongoDb } from './../../core/trash/db';
import { MongoExtDb } from '../../core/trash/db-ext';

import { async } from './../../async';
import { PipeInjector } from '../../core/pipe-injector.interface';
import { Messager } from '../../core/messager.interface';
import { Job } from './../job.interface';
import { DI, DIService } from './../../core/di';
import { ExtService } from '../../core/services/ext.service';

// - unitId

// - get Unit
// - get Company
// - get Line
// - get Attrs
// - get Categories

// - get ResourceItemProccesseds
// - get Resources
// - get that are mathed wit unit-item
// 
// => unit-aggregated



// "search"
// "productLine"
// "readableName"
// "name"
// "productId"
// "company"

export class AggregateJob implements Job {
	private options: any;
	private messager: Messager;
	private di: DI;
	private pipePath: string;

	constructor(
		options: any,
		injector: PipeInjector,
		messager: Messager
	) {
		this.options = options;
		this.messager = messager;
	}

	setSchemeId(schemeId: string) {
		return this;
	}

	setStaticOptions(options: any) {
		return this;
	}

	setDI(di: DI) {
		this.di = di;
		return this;
	}

	setPipePath(path: string) {
		this.pipePath = path;
		return this;
	}

	// info.data = array or item
	/*
		{
			data: {
				productiD
			}
		}
	*/
	run(info: any) {
		if (!info) {
			return async(null);
		}
		let unitId = '';
		let resource = '';

		if (this.options.fromRoot) {
			unitId = info.productId;
			resource = info.resource;
		} else {
			if (typeof info === 'string') {
				unitId = info;
			} else {
				const data = info.data;
				const item = Array.isArray(data) ? data[0] : data;
				if (!item) {
					return async(null);
				}
				unitId = item.productId;
				resource = item.resourceId;
			}	
		}

		if (!unitId) {
			return async({
				...info,
			});
		}

		return combineLatest(
			this.getUnitParts(unitId),
			this.getAssignedItems(unitId)
		).pipe(
			mergeMap(d => {
				debugger;
				const unitParts = d[0];
				const items = d[1];
				const company = unitParts.company;
				const line = unitParts.line;
				const categories = unitParts.categories;
				const attributes = unitParts.attributes;
				const unit = unitParts.unit;
				const resourcesIds = items.map(i => i.resource);

				return this.getResources(resourcesIds)
					.pipe(
						map(d => {
							return {
								resources: d,
								items: items,
								company: company,
								line: line,
								categories: categories,
								attributes: attributes,
								unit: unit
							}
						})
					);
			}),
			mergeMap(d => {
				const company = d.company;
				const line = d.line;
				const categories = d.categories;
				const attributes = d.attributes;
				const unit = d.unit;
				const resources = d.resources;
				const items = d.items;

				// if (!items.length) {
				// 	return async('$stop');
				// }

				let search = items
					.map(i => {
						const attrs = i.attributes.map(a => {
							return a.value;
						});
						return i.title + ' ' + attrs.join(' ');
					})
					.join(' ');

				if (line) {
					search = search + ' ' + line.name;
				}
				if (categories.length) {
					categories.forEach(c => {
						search = search + ' ' + c.name;
					});
				}
				if (company) {
					search = search + ' ' + company.name;
				}

				let readableName = this.makeReadable(unit.name);
				if (line) {
					readableName = this.makeReadable(line.name) + '_' + readableName;
				}
				if (company) {
					readableName = this.makeReadable(company.name) + '_' + readableName;
				}
				const agg: any = {
					logo: unit.logo,
					productId: unit._id.toString(),
					visible: unit.visible,
					search: search,
					name: unit.translate ? unit.translate + ' / ' + unit.name : unit.name,
					readableName: readableName,
					description: unit.description,
					seo: unit.seo,
					reviews: unit.reviews,
					reviewsRating: unit.reviewsRating,
					updatedDate: Date.now(),

					items: items.map(i => {
						return {
							id: i._id.toString(),
							available: i.available,
							price: i.price,
							url: i.url,
							productAttributes: i.attributes,
							market: resources
								.filter(r => r._id.toString() === i.resource)
								.map(r => {
									return {
										code: r.code,
										// id: r._id.toString(),
										logo: r.logo,
										name: r.name
									};
								})[0]
						};
					}),
					productAttributes: attributes.map(a => {
						return {
							name: a.name,
							code: a.code,
							type: a.type,
							values: a.values.map(v => {
								return {
									value: v.value,
									code: v.code
								}
							})
						};
					}),
					categories: categories.map(c => {
						return {
							name: c.name,
							code: c.code
							// id: c._id.toString()
						};
					}),
					company: {
						name: company.name,
						logo: company.logo,
						code: company.code
						// id: company._id.toString()
					},
					productLine: line? {
						// id: line._id.toString(),
						code: line.code,
						logo: line.logo,
						name: line.name
					}: null
				};

				return this.getCustomFieldsAll(agg)
					.pipe(
						mergeMap((fields) => {
							agg.fields = fields;
							return this.save(agg)
								.pipe(
									map(d => {
										return {
											aggregated: d,
											resourceId: resource
										}
									})
							);
						})
					);
			})
		);
	}

	destroy() {
		return this;
	}

	private save(agg: any) {
		return new MongoDb('wl', true)
			.find({})
			.pipe(
				map(d => {
					return d[0].db;
				}),
				mergeMap(db => {
					let url = 'mongodb://' + db.ip + ':' + db.port;
					if (db.query) {
						url = url + '/?' + db.query;
					}
					debugger;
					return new MongoDb('aggregated-products2', true, url, db.db)
						.replaceOne(
							{
								productId: agg.productId
							},
							agg,
							{
								upsert: true
							}
						)
						.pipe(
							map(() => {
								return agg;
							})
						);
				})
			)
	}

	private getAssignedItems(unitId: string) {
		return this.getProcessedItems(unitId)
			.pipe(
				mergeMap(items => {
					const ids = items.map(i => i._id.toString());

					return this.getUnitItems(ids)
						.pipe(
							map(unitItems => {
								const itemProcessedIds = unitItems.map(i => i.itemProcessedId);
								return items.filter(i => {
									return itemProcessedIds.includes(i._id.toString());
								});
							})
						);
				})
			);
	}

	private getResources(resourcesIds: string[]) {
		return new MongoDb('resource', true)
			.find({
				_id: {
					$in: resourcesIds.map(i => ObjectId(i))
				}
			});
	}

	private getUnitItems(processedItemsIds: string[]) {
		return new MongoDb('unit-item', true)
			.find({
				itemProcessedId: {
					$in: processedItemsIds
				}
			});
	}

	private getProcessedItems(unitId: string) {
		return new MongoDb('resource-processed-item', true)
			.find({
				productId: unitId
			});
	}

	private getUnitParts(unitId: string) {
		return this.getUnit(unitId)
			.pipe(
				mergeMap(unit => {
					const companyid = unit.company;
					const lineId = unit.productLine;
					const categoriesIds = unit.categories;
					const attributesIds = unit.productAttributes;

					return combineLatest(
						(lineId && typeof lineId === 'string') ? this.getline(lineId) : async(null),
						companyid ? this.getCompany(companyid) : async(null),
						categoriesIds.length ? this.getCategories(categoriesIds) : async([]),
						attributesIds.length ? this.getAttributes(attributesIds) : async([])
					).pipe(
						map(d => {
							return {
								unit: unit,
								line: d[0],
								company: d[1],
								categories: d[2],
								attributes: d[3]
							}
						})
					)
				})
			);
	}

	private getAttributes(attributesIds: string[]) {
		return new MongoExtDb('product-attributes', true)
			.find({
				_id: {
					$in: attributesIds.map(i => ObjectId(i))
				}
			})
	}

	private getCategories(categoriesIds: string[]) {
		return new MongoExtDb('categories', true)
			.find({
				_id: {
					$in: categoriesIds.map(i => ObjectId(i))
				}
			})
	}

	private getline(lineId: string) {
		return new MongoExtDb('product-lines', true)
			.findOne({
				_id: ObjectId(lineId)
			})
	}

	private getCompany(companyId: string) {
		return new MongoExtDb('companies', true)
			.findOne({
				_id: ObjectId(companyId)
			})
	}

	private getUnit(unitId: string) {
		return new MongoExtDb('products', true)
			.findOne({
				_id: ObjectId(unitId)
			})
	}

	private getCustomFieldsAll(agg: any) {
		const company = this.getCustomFields(agg.company.code, 'company');
		const unitLine = agg.productLine ? this.getCustomFields(agg.productLine.code, 'unit-line') : of(null);
		const unit = this.getCustomFields(agg.logo, 'unit');

		return combineLatest(company, unitLine, unit)
			.pipe(
				map(d => {
					const companyFields = d[0];
					const unitLineFields = d[1];
					const unitFields = d[2];
					const fields = [];

					companyFields.fields
						.filter(f => f.inheritance)
						.forEach(f => {
							const i = fields.indexOf(cf => cf.code === f.code);
							if (!!~i) {
								fields[i] = f;
								return;
							}
							fields.unshift(f);
						});

					if (unitLineFields) {
						unitLineFields.fields
							.filter(f => f.inheritance)
							.forEach(f => {
								console.log(f);
								const i = fields.indexOf(cf => cf.code === f.code);
								if (!!~i) {
									fields[i] = f;
									return;
								}
								fields.unshift(f);
							})
					}

					unitFields.fields
						.forEach(f => {
							const i = fields.indexOf(cf => cf.code === f.code);
							if (!!~i) {
								fields[i] = f;
								return;
							}
							fields.unshift(f);
						});

					return fields;
				})
			);

	}

	private getCustomFields(ownerCode: string, ownerType: string) {
		return new MongoDb('custom-fields', true)
			.find({
				ownerCode: ownerCode,
				ownerType: ownerType
			})
			.pipe(
				map(d => {
					return d[0] || { fields: [] };
				})
			);
	}

	makeReadable(str: string) {
		str = this.rus_to_latin(str);
		return str.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^\w-]+/g, '');
	}

	rus_to_latin (str: string) {
		if (!str.match(/[А-я]/g)) {
			return str;
		}
		var ru = {
			'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 
			'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i', 
			'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 
			'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 
			'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 
			'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
		}, n_str = [];
		
		str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');
		
		for ( var i = 0; i < str.length; ++i ) {
		   n_str.push(
				  ru[ str[i] ]
			   || ru[ str[i].toLowerCase() ] == undefined && str[i]
			   || ru[ str[i].toLowerCase() ].replace(/^(.)/, function ( match ) { return match.toUpperCase() })
		   );
		}
		
		return n_str.join('');
	}
}