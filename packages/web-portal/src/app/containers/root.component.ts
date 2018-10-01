import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CompanyDto, CategoryDto, MarketDto, ProductDto, ProductLineDto, ProductAttributeDto, MarketProductDto } from '@magz/common';

import { FiltersRestService } from '@rest/filters';
import { CompaniesRestService } from '@rest/companies';
import { MarketsRestService } from '@rest/markets';
import { CategoriesRestService } from '@rest/categories';
import { ProductsRestService } from '@rest/products';
import { ProductAttributesRestService } from '@rest/product-attributes';
import { ProductLinesRestService } from '@rest/product-lines';

import { ProductFullDto } from '@rest/products/product-full.dto';

@Component({
	selector: 'root',
	templateUrl: './root.html',
	styleUrls: ['./root.scss'],
	providers: [
		FiltersRestService,
		CompaniesRestService,
		MarketsRestService,
		CategoriesRestService,
		ProductsRestService,
		ProductAttributesRestService,
		ProductLinesRestService
	]
})

export class RootComponent {
	opennedSideBar = true;
	filters: any[] = [];

	queries: any = {
		attributes: [],
		markets: [],
		companies: [],
		categories: [],
		productLines: [],
		productAttributes: [],
		page: 0,
		itemsPerPage: 10
	};

	filtersSelections: any = {};

	companies: CompanyDto[] = [];
	markets: MarketDto[] = [];
	categories: CategoryDto[] = [];
	productLines: ProductLineDto[] = [];
	productAttributes: ProductAttributeDto[] = [];

	productsTotal = 0;
	products: ProductFullDto[] = [];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private filtersService: FiltersRestService,
		private companiesService: CompaniesRestService,
		private marketsService: MarketsRestService,
		private categoriesService: CategoriesRestService,
		private productsService: ProductsRestService,
		private productAttributesService: ProductAttributesRestService,
		private productLinesService: ProductLinesRestService
	) {
		window['a'] = this;
		route.queryParams.subscribe(p => {
			this.queries = this.fixRouteQueries(p);
			this.convertQueriesToPlainObject();
			this.fetchProducts();
		});
		this.fetchCompanies();
		this.fetchMarkets();
		this.fetchProductAttributes();
		this.fetchProductLines();
		this.fetchCategories();

		this.filtersService.list()
			.subscribe(d => {
				this.filters = d.map(i => {
					return {
						label: i.label,
						type: i.type,
						attribute: i.attribute,
						opened: false
					};
				});
			});
	}

	getMarket(id: string) {
		return this.markets.find(i => i._id === id);
	}

	getCompany(id: string) {
		return this.companies.find(i => i._id === id);
	}

	getSelected(type, attrId: string) {
		if (type === 'PRODUCT_ATTRIBUTE') {
			const attribute = this.productAttributes.find(i => i._id === attrId);
			if (!attribute) {
				return new Map();
			}
			return this.filtersSelections.attributes.get(attribute);
		}
		if (type === 'CATEGORY') {
			return this.filtersSelections.categories || new Map();
		}
		if (type === 'COMPANIES') {
			return this.filtersSelections.companies || new Map();
		}
		if (type === 'MARKETS') {
			return this.filtersSelections.markets || new Map();
		}
		if (type === 'PRODUCT_LINE') {
			return this.filtersSelections.productLines || new Map();
		}
	}

	handleQueries(list: any, filter: any) {
		if (filter.type === 'PRODUCT_ATTRIBUTE') {
			this.queries.attributes = this.queries.attributes.filter(l => {
				return !l.startsWith(filter.attribute);
			});
			this.queries.attributes.push(filter.attribute + '-' + list
				.map(n => n.value)
				.join('='));
		}
		if (filter.type === 'CATEGORY') {
			this.queries.categories = list.map(i => i._id);
		}
		if (filter.type === 'COMPANIES') {
			this.queries.companies = list.map(i => i._id);
		}
		if (filter.type === 'MARKETS') {
			this.queries.markets = list.map(i => i._id);
		}
		if (filter.type === 'PRODUCT_LINE') {
			this.queries.productLines = list.map(i => i._id);
		}
		this.router.navigate([], {
			queryParams: this.queries
		});
		this.convertQueriesToPlainObject();
	}

	fixRouteQueries(obj: any) {
		console.log(obj, '===');
		const o: any = {
			attributes: [],
			markets: [],
			companies: [],
			categories: [],
			productLines: [],
			productAttributes: [],
			page: 0,
			itemsPerPage: 10
		};
		const keys = Object.keys(obj);
		if (!keys.length) {
			return o;
		}
		keys.forEach(p => {
			let value = obj[p];
			if (p === 'page') {
				value = +obj[p] || 0;
				o[p] = value;
				return;
			}
			if (p === 'itemsPerPage') {
				value = +obj[p] || 10;
				o[p] = value;
				return;
			}
			if (!value) {
				value = [];
			} else {
				value = Array.isArray(value) ? value : [value];
				if (p === 'attributes') {
					value = value.filter(a => {
						const segments = a.split('-');
						return !!segments[1];
					});
				}
			}
			o[p] = value;
		});

		return o;
	}

	convertQueriesToPlainObject() {
		const attributesMap = new Map<ProductAttributeDto, Map<any, boolean>>();
		this.queries.attributes
			.forEach((n: string) => {
				const f = n.split('-');
				const attributeId = f[0];
				const attributeValues = f[1].split('=');
				const attribute = this.productAttributes.find(i => i._id === attributeId);
				if (!attribute) {
					return;
				}
				const valuesMap = new Map<any, boolean>();
				attribute.values
					.filter(v => attributeValues.includes(v.value))
					.forEach(v => {
						valuesMap.set(v, true);
					});
				attributesMap.set(attribute, valuesMap);
			});

		const marketsMap = new Map<MarketDto, boolean>();
		this.queries.markets.forEach(id => {
			const market = this.markets.find(i => i._id === id);
			if (!market) {
				return;
			}
			marketsMap.set(market, true);
		});

		const categoriesMap = new Map<CategoryDto, boolean>();
		this.queries.categories.forEach(id => {
			const market = this.categories.find(i => i._id === id);
			if (!market) {
				return;
			}
			categoriesMap.set(market, true);
		});

		const companiessMap = new Map<CompanyDto, boolean>();
		this.queries.companies.forEach(id => {
			const market = this.companies.find(i => i._id === id);
			if (!market) {
				return;
			}
			companiessMap.set(market, true);
		});

		const productLinesMap = new Map<ProductLineDto, boolean>();
		this.queries.productLines.forEach(id => {
			const market = this.productLines.find(i => i._id === id);
			if (!market) {
				return;
			}
			productLinesMap.set(market, true);
		});

		const obj = {
			attributes: attributesMap,
			markets: marketsMap,
			categories: categoriesMap,
			companies: companiessMap,
			productLines: productLinesMap,
		};
		this.filtersSelections = obj;
	}

	getProductAttribute(attributeId: string) {
		return this.productAttributes.find(i => i._id === attributeId);
	}

	getChildrenByType(type: string) {
		if (type === 'MARKETS') {
			return this.markets;
		}
		if (type === 'COMPANIES') {
			return this.companies;
		}
		if (type === 'CATEGORY') {
			return this.categories;
		}
		if (type === 'PRODUCT_ATTRIBUTE') {
			return this.productAttributes;
		}
		if (type === 'PRODUCT_LINE') {
			return this.productLines;
		}
		return [];
	}

	openFilter(filter: any) {
		filter.opened = !filter.opened;
		this.filters
			.filter(a => a !== filter)
			.forEach(a => a.opened = false);
	}

	fetchCompanies() {
		this.companiesService.list({})
			.subscribe(d => {
				this.companies = d;
				this.convertQueriesToPlainObject();
			});
	}

	fetchCategories() {
		this.categoriesService.list({})
			.subscribe(d => {
				this.categories = d;
				this.convertQueriesToPlainObject();
			});
	}

	fetchMarkets() {
		this.marketsService.list({})
			.subscribe(d => {
				this.markets = d;
				this.convertQueriesToPlainObject();
			});
	}

	fetchProductLines() {
		this.productLinesService.list({})
			.subscribe(d => {
				this.productLines = d;
				this.convertQueriesToPlainObject();
			});
	}

	fetchProductAttributes() {
		const s = this.productAttributesService.list({});
		s.subscribe(d => {
			this.productAttributes = d;
			this.convertQueriesToPlainObject();
		});
		return s;
	}

	fetchProducts() {
		const available = true;
		const products = this.productsService.list({
			available: available,
			markets: this.queries.markets,
			company: this.queries.companies,
			categories: this.queries.categories,
			attributes: this.queries.attributes,
			page: this.queries.page,
			itemsPerPage: this.queries.itemsPerPage
		});
		products
			.subscribe(list => {
				this.products = list.items;
				this.productsTotal = list.total;

				this.products.forEach(p => {
					p.items = p.items
						.sort((a, b) => {
							return a.price - b.price;
						});
				});
			});
	}
}
