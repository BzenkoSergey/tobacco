import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { combineLatest } from 'rxjs';

import { FiltersService } from './../../filters.service';
import { MenuService } from './../../menu.service';
import { LinkService } from './../../link.service';
import { Utils } from './../../utils';

import { MixesRestService } from '@rest/mixes';

@Component({
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [
		MixesRestService
	]
})

export class OverviewComponent implements OnDestroy {
	productsQueries: any = {};
	queries: any = {
		markets: [],
		companies: [],
		productLines: [],
		page: 0,
		itemsPerPage: 25,
		search: ''
	};

	items: any = [];

	showFilter = false;
	productsTotal = 0;
	loading = false;

	openedId: string|null = null;
	queriesMap = new Map<string, string[]>();
	menu: any;
	pageTitle = '';

	openned = new Map<string, boolean>();
	search = '';

	constructor(
		private router: Router,
		route: ActivatedRoute,
		private filters: FiltersService,
		private title: Title,
		private meta: Meta,
		private linkService: LinkService,
		private mixesRestService: MixesRestService,
		private menuService: MenuService
	) {
		this.filters.setCode('MIXES');
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
			this.defineMeta();
			this.fetchProducts();
		});
	}

	ngOnDestroy() {
		this.filters.setCode(null);
		this.meta.removeTag('name="description"');
		this.meta.removeTag('name="title"');
		this.meta.removeTag('name="keywords"');
		this.meta.removeTag('property="og:title"');
		this.meta.removeTag('property="og:url"');
		this.meta.removeTag('property="og:description"');
	}

	getMenuItems() {
		if (!this.menu) {
			return [];
		}
		return this.menu.menu.filter(i => {
			return i.code !== 'resource' && i.code !== 'category' && i.code !== 'WEIGHT';
		});
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
		let title = '';
		const keywords = 'миксы для кальяна, миксы табака для кальяна, кальянные миксы, миксы табаков для кальяна';
		let description = this.getContext() || 'Все кальянные миксы которые можно найти. Каждый микс содержит информацию о доступности для покупки составляющих табаков а также их стоимость по минимальной цене в рамках украины.';

		this.getTitle();
		title = this.pageTitle;
		title = title  || 'Миксы табаков для кальяна';

		if (this.queries.page) {
			title = title + ' страница ' + (this.queries.page + 1);
			description = description + ' страница ' + (this.queries.page + 1);
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

	getContext() {
		const company = this.queriesMap.get('company') || [];
		const unitLine = this.queriesMap.get('unit-line') || [];
		if (!company.length) {
			return '';
		}
		let str = 'табаком';
		if (company.length > 1) {
			str = 'табаками';
		}
		const item = this.getItem('company', this.menu.menu);
		str = str + ' ' + company
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

		return 'Узнай что можно смиксовать с ' + str + ' и сколько будет стоить твой микс';
	}

	getTitle(): string {
		if (!this.queriesMap.set || !this.menu) {
			this.pageTitle = '';
			return;
		}
		const company = this.queriesMap.get('company') || [];
		const unitLine = this.queriesMap.get('unit-line') || [];

		if (!company.length && !unitLine.length) {
			this.pageTitle = '';
			return;
		}

		let title = '';
		if (company.length) {
			title = 'Кальянные миксы c';
			if (company.length > 1) {
				title += ' табаками';
			} else {
				title += ' табаком';
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

		this.pageTitle = title;
	}

	private getItem(code: string, items: any[]) {
		return items.find(i => i.code === code);
	}

	private getOption(code: string, options: any[]) {
		return options.find(i => i.code === code);
	}

	defineQueries() {
		this.queriesMap.forEach((v, k) => {
			if (k === 'company') {
				this.queries.companies = v;
			}
			if (k === 'unit-line') {
				this.queries.lines = v;
			}
		});
	}

	fetchProducts() {
		this.loading = true;
		this.productsQueries = {
			company: this.queries.companies,
			line: this.queries.lines || [],
			page: this.queries.page,
			itemsPerPage: this.queries.itemsPerPage,
			search: this.queries.search || ''
		};

		this.mixesRestService.list(this.productsQueries)
			.subscribe(d => {
				this.items = d.items;
				this.productsTotal = d.total;
				this.loading = false;
			});
	}
}
