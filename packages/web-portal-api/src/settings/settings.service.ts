import { Observable, Subject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { MongoDb } from './../shared/db';

import { PortalSettingsDto } from './settings.dto';

var express = require('express');
var router = express.Router();


class Dto {
	label: string;
	type: string;
	values: {label: string, code: string}[];

	constructor(d?: Dto) {
		if (!d) {
			return;
		}
		this.label = d.label;
		this.type = d.type;
		this.values = d.values;
	}
}

function getByParent(categories: any[], parentCategory: string) {
	const list = categories
		.filter(c => {
			const parent = c.parent ? c.parent.toString(): null;
			return parent === parentCategory;
		});
	let children = [];
	list.forEach(i => {
		children = children.concat(getByParent(categories, i._id.toString()));
	});
	return list.concat(children);
}

function fetchCategories() {
	return new MongoDb('categories').find({});
}

function fetchProductLines() {
	return new MongoDb('product-lines').find({});
}

function fetchMarkets() {
	return new MongoDb('markets').find({});
}

function fetchCompanies() {
	return new MongoDb('companies').find({});
}

function fetchProductAttributes() {
	return new MongoDb('product-attributes').find({});
}

function fetchSettings() {
	return new MongoDb('portal-settings').find({})
		.pipe(
			map(d => {
				return d.map(i => new PortalSettingsDto(i))[0];
			})
		);
}

function fetchFilters() {
	const companies = fetchCompanies();
	const settings = fetchSettings();
	const attributes = fetchProductAttributes();
	const markets = fetchMarkets();
	const productLines = fetchProductLines();
	const categories = fetchCategories();
	return combineLatest(settings, attributes, companies, markets, productLines, categories)
		.pipe(
			map((a: [PortalSettingsDto, any[], any[], any[], any[], any[]]) => {
				const settings = a[0];
				const attributes = a[1];
				const companies = a[2];
				const markets = a[3];
				const productLines = a[4];
				const categories = a[5];
				const filters = settings.filters.map(f => {
					const attr = attributes.find(s => s._id.toString() === f.attribute);
					const d = new Dto();
					d.label = f.label;
					d.type = f.type;
					d.values = [];
					if (f.type === 'PRODUCT_ATTRIBUTE') {
						d.values = attr.values.map(a => {
							return {
								label: a.value,
								code: attr._id.toString()
							};
						});
					}
					if (f.type === 'CATEGORY') {
						d.values = getByParent(categories, f.parentCategory)
							.map(a => {
								return {
									label: a.name,
									code: a._id.toString()
								};
							});
					}
					if (f.type === 'COMPANIES' && f.companies) {
						d.values = companies.map(a => {
							return {
								label: a.name,
								code: a._id.toString()
							};
						});
					}
					if (f.type === 'MARKETS' && f.markets) {
						d.values = markets.map(a => {
							return {
								label: a.name,
								code: a._id.toString()
							};
						});
					}
					if (f.type === 'PRODUCT_LINES' && f.productLines) {
						d.values = productLines.map(a => {
							return {
								label: a.name,
								code: a._id.toString()
							};
						});
					}
					return d;
				});
				return filters;
			})
		);
}

router.get('/settings', (req, res, next) => {
	fetchSettings()
		.subscribe(d => {
			res.status(200).json(d.filters);
		});
});

export { router };

