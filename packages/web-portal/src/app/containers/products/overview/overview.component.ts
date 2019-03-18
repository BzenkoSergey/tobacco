import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { combineLatest } from 'rxjs';

import { FiltersService } from './../../filters.service';
import { MenuService } from './../../menu.service';
import { LinkService } from './../../link.service';
import { Utils } from './../../utils';

import { WikiRestService, WikiFieldDto } from '@rest/wiki';

@Component({
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [
		WikiRestService
	]
})

export class OverviewComponent implements OnDestroy {
	productsQueries: any = {};
	queries: any = {
		attributes: [],
		markets: [],
		companies: [],
		categories: [],
		productLines: [],
		productAttributes: [],
		page: 0,
		itemsPerPage: 25,
		search: ''
	};

	showFilter = false;
	productsTotal = 0;

	openedId: string|null = null;
	queriesMap = new Map<string, string[]>();
	menu: any;
	pageTitle = '';
	wiki: any[] = [];

	openned = new Map<string, boolean>();
	search = '';

	constructor(
		private router: Router,
		route: ActivatedRoute,
		private filters: FiltersService,
		private title: Title,
		private meta: Meta,
		private linkService: LinkService,
		private wikiRestService: WikiRestService,
		private menuService: MenuService
	) {
		combineLatest(
			route.params,
			route.queryParams,
			this.menuService.get()
		)
		.subscribe(d => {
			this.openedId = null;
			const params = d[0];
			const queryParams = d[1];
			this.menu = d[2];

			this.linkService.updateTag({
				rel: 'canonical',
				href: window.location.origin + this.router.url
			});

			const query: any = {};
			Object.keys(params)
				.forEach(prop => {
					let value = params[prop] || '';
					value = value.split(',').filter(v => v !== 'all');
					query[prop] = value;
					this.queriesMap.set(prop, value);
					this.defineQueries();
				});
			this.filters.push(query);

			this.queries.search = queryParams['search'] || '';
			this.queries.page = isNaN(+queryParams['page']) ? 0 : +queryParams['page'];
			this.fetchWiki();
			this.fetchProducts();
		});
	}

	ngOnDestroy() {
		this.meta.removeTag('name="description"');
		this.meta.removeTag('name="title"');
		this.meta.removeTag('name="keywords"');
		this.meta.removeTag('property="og:title"');
		this.meta.removeTag('property="og:url"');
	}

	getMenuItems() {
		if (!this.menu) {
			return [];
		}
		return this.menu.menu.filter(i => i.code !== 'resource');
	}

	hasFilters() {
		return !!this.queriesMap.size;
	}

	filter(itemsCodes: string[], filter: any) {
		const filterCode = filter.code;
		const query: any = {};
		query[filterCode] = itemsCodes;
		if (filterCode === 'company') {
			query['unit-line'] = [];
		}

		Object.keys(query)
			.forEach(p => {
				this.queriesMap.set(p, query[p]);
			});

		const path = Utils.genPathUrl(this.queriesMap);
		this.router.navigate(path, {
			queryParamsHandling: 'merge'
		});
	}

	openFilter(code: string, close?: boolean|undefined) {
		const state = this.openned.get(code);
		if (close) {
			this.openned.set(code, false);
			return;
		}
		this.openned.set(code, !state);
	}

	filterSelected(code: string) {
		const list = this.queriesMap.get(code);
		return list && list.length && list[0] !== 'all';
	}

	getMenuOptions(i: any) {
		const options = i.options;
		return options.filter(o => {
			if (!o.dependOn || !o.dependOn.item) {
				return true;
			}
			const items = this.queriesMap.get(o.dependOn.item) || [];
			return !!~items.indexOf(o.dependOn.option);
		});
	}

	defineMeta() {
		const wiki = this.wiki[0];
		let title = '';
		let keywords = 'заправка до кальяну, кальянный магазин, магазин табака, мир табака, кальяни купити';
		let description = 'Кальянные продукты';
		if (!wiki) {
			this.getTitle();
			title = this.pageTitle;
			description = title ? 'Кальянные продукты: ' + title + ' доступные для покупки по лучшим ценам.' : 'Все кальянные продукты доступные для покупки по лучшим ценам.';
		} else {
			title = wiki.meta.title;
			if (!title) {
				this.getTitle();
				title = this.pageTitle;
			}
			description = wiki.meta.description || description;
			if (description === 'Кальянные продукты') {
				description = title ? 'Кальянные продукты: ' + title + ' доступные для покупки по лучшим ценам.' : 'Все кальянные продукты доступные для покупки по лучшим ценам.';
			}
			keywords = wiki.meta.keywords || keywords;
		}
		title = title  || 'Кальянные продукты';

		if (this.queries.page) {
			title = title + ' страница ' + (this.queries.page + 1);
		}
		this.title.setTitle(title);
		this.meta.updateTag({
			name: 'description',
			content: description
		});
		this.meta.updateTag({
			name: 'keywords',
			content: keywords
		});
		this.meta.updateTag({
			property: 'og:url',
			content: window.location.origin + this.router.url
		});
		this.meta.updateTag({
			property: 'og:title',
			content: title
		});
		this.meta.updateTag({
			property: 'og:description',
			content: description
		});
	}

	getWiki() {
		return this.wiki.map(w => {
			return w.fields
				.filter(f => f.visible)
				.sort((a, b) => {
					return a.order - b.order;
				})
				.map(f => this.genFieldTemplate(f));
		});
	}

	genFieldTemplate(f: WikiFieldDto): string {
		if (f.tag) {
			let attrs = '';
			f.adds.forEach(a => {
				attrs += ` ${a.name}="${a.value}"`;
			});
			if (f.tag === 'img') {
				return `<${f.tag}${attrs}>`;
			}
			if (!f.value) {
				return '';
			}
			return `<${f.tag}${attrs}>${f.value}</${f.tag}>`;
		}
		if (!f.value) {
			return '';
		}
		return `${f.value}`;
	}

	getTitle(): string {
		if (!this.queriesMap.set || !this.menu) {
			this.pageTitle = '';
			return;
		}
		const category = this.queriesMap.get('category') || [];
		const company = this.queriesMap.get('company') || [];
		const unitLine = this.queriesMap.get('unit-line') || [];
		const weight = this.queriesMap.get('WEIGHT') || [];

		if (!category.length && !company.length && !unitLine.length && !weight.length) {
			this.pageTitle = '';
			return;
		}

		let title = '';
		if (category.length) {
			const item = this.getItem('category', this.menu.menu);
			title = category
				.map(o => {
					return this.getOption(o, item.options).label;
				})
				.join(', ');
		}
		if (company.length) {
			if (!category.length) {
				title = 'Бренд';
				if (company.length > 1) {
					title = 'Бренды';
				}
			}
			const item = this.getItem('company', this.menu.menu);
			title = title + ' ' + company
				.map(o => {
					let linesTitles = '';
					if (unitLine.length) {
						const lineItem = this.getItem('unit-line', this.menu.menu);
						const lines = unitLine
							.map(l => this.getOption(l, lineItem.options))
							.filter(opt => {
								return opt.dependOn.option === o;
							})
							.map(opt => {
								return opt.label;
							});
						linesTitles = lines.join(' и ');
					}
					if (!this.getOption(o, item.options)) {
						return null;
					}
					return this.getOption(o, item.options).label + (linesTitles ? ' ' + linesTitles : '');
				})
				.filter(i => !!i)
				.join(', ');
		}

		if (weight.length) {
			if (!title) {
				title = 'Вес ';
			}
			const item = this.getItem('WEIGHT', this.menu.menu);
			title = title + ' ' + weight
				.map(o => {
					return this.getOption(o, item.options).label;
				})
				.join(', ');
		}

		this.pageTitle = title;
	}

	private getItem(code: string, items: any[]) {
		return items.find(i => i.code === code);
	}

	private getOption(code: string, options: any[]) {
		return options.find(i => i.code === code);
	}

	tooggleItems(id: string) {
		if (id === this.openedId) {
			this.openedId = null;
			return false;
		}
		this.openedId = id;
	}

	defineQueries() {
		this.queriesMap.forEach((v, k) => {
			if (k === 'resource') {
				this.queries.markets = v;
			}
			if (k === 'company') {
				this.queries.companies = v;
			}
			if (k === 'WEIGHT') {
				this.queries.attributes = v;
			}
			if (k === 'category') {
				this.queries.categories = v;
			}
			if (k === 'unit-line') {
				this.queries.lines = v;
			}
		});
	}

	fetchProducts() {
		this.productsQueries = {
			available: true,
			markets: this.queries.markets,
			company: this.queries.companies,
			line: this.queries.lines || [],
			categories: this.queries.categories,
			attributes: this.queries.attributes,
			page: this.queries.page,
			itemsPerPage: this.queries.itemsPerPage,
			search: this.queries.search || ''
		};
	}

	private fetchWiki() {
		const obj: any = {};
		let empty = true;
		this.queriesMap.forEach((value, key) => {
			if (value.length) {
				empty = false;
			}
			obj[key] = value;
		});
		if (empty || this.queries.page || this.queries.search) {
			this.wiki = [];
			this.defineMeta();
			return;
		}

		this.wikiRestService.list(obj)
			.subscribe(d => {
				this.wiki = d;
				this.defineMeta();
			});
	}
}
