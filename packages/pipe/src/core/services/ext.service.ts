import { MongoExtDb } from '../trash/db-ext';
import { async } from '../../async';

import { tap } from 'rxjs/operators';

export class ExtService {
	private companiesDb = new MongoExtDb('companies');
	private productLinesDb = new MongoExtDb('product-lines');
	private productAttributesDb = new MongoExtDb('product-attributes');
	private productsDb = new MongoExtDb('products');
	private companies: any[] = [];
	private productLines: any[] = [];
	private products: any[] = [];
	private productAttributes: any[] = [];

	getProducts() {
		if (this.products.length) {
			return async(this.products);
		}
		return this.productsDb.find({})
			.pipe(
				tap(d => {
					this.products = d;
				})
			);
	}

	getCompanies() {
		if (this.companies.length) {
			return async(this.companies);
		}
		return this.companiesDb.find({})
			.pipe(
				tap(d => {
					this.companies = d;
				})
			);
	}

	getProductLines() {
		if (this.productLines.length) {
			return async(this.productLines);
		}
		return this.productLinesDb.find({})
			.pipe(
				tap(d => {
					this.productLines = d;
				})
			);
	}

	getProductAttributes() {
		if (this.productAttributes.length) {
			return async(this.productAttributes);
		}
		return this.productAttributesDb.find({})
			.pipe(
				tap(d => {
					this.productAttributes = d;
				})
			);
	}
}