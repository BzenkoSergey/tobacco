import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';
import { BreadcrumbModel } from '@components/breadcrumb/breadcrumb.model';

import { FiltersService } from './filters.service';
import { MenuService } from './menu.service';
import { Utils } from './utils';
import { AnalyticsService } from './analytics.service';

@Component({
	selector: 'root',
	templateUrl: './root.html'
})

export class RootComponent {
	queriesMap = new Map<string, string[]>();
	menu: any;
	search = '';

	constructor(
		breadcrumb: BreadcrumbService,
		analyticsService: AnalyticsService,
		private menuService: MenuService,
		private filters: FiltersService,
		private router: Router,
		meta: Meta,
		route: ActivatedRoute
	) {
		router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				analyticsService.changeUrl();
				(<any>window).ga('set', 'page', event.urlAfterRedirects);
				(<any>window).ga('send', 'pageview');
			}
		});

		meta.updateTag({
			property: 'og:site_name',
			content: 'Hoogle.com.ua'
		});
		breadcrumb.add([
			new BreadcrumbModel({
				title: 'Главная',
				url: ['/'],
				code: 'home',
				icon: 'home'
			})
		]);

		this.menuService.get()
			.subscribe(menu => {
				this.menu = menu;
				this.filters.get()
					.subscribe(p => {
						this.queriesMap = new Map<string, string[]>();
						Object.keys(p)
							.forEach(prop => {
								let value = p[prop];
								value = Array.isArray(value) ? value : [value];
								this.queriesMap.set(prop, value);
							});

						breadcrumb.remove('products');
						breadcrumb.remove('mixes');
						let code = 'products';
						if (this.filters.getCode() === 'MIXES') {
							code = 'mixes';
						}
						breadcrumb.replaceAll([
							this.genPath()
						], code);
					});
			});

		route.queryParams
			.subscribe(p => {
				this.search = p.search || '';
			});
	}

	performSearch(text: string) {
		const path = Utils.genPathUrl(this.queriesMap, this.filters.getCode() === 'MIXES');
		this.router.navigate(path, {
			queryParams: {
				page: 0,
				search: text
			},
			queryParamsHandling: 'merge'
		});
	}

	private genPath(): BreadcrumbModel {
		const resource = this.queriesMap.get('resource') || [];
		const category = this.queriesMap.get('category') || [];
		const company = this.queriesMap.get('company') || [];
		const unitLine = this.queriesMap.get('unit-line') || [];
		const weight = this.queriesMap.get('WEIGHT') || [];

		let resourceLine = Utils.isNotEmptyArray(resource) ? resource.join(',') : '';
		let categoryLine = Utils.isNotEmptyArray(category) ? category.join(',') : '';
		let companyLine = Utils.isNotEmptyArray(company) ? company.join(',') : '';
		let unitLineLine = Utils.isNotEmptyArray(unitLine) ? unitLine.join(',') : '';
		const weightLine = Utils.isNotEmptyArray(weight) ? weight.join(',') : '';

		const titles = [];
		if (weightLine && !unitLineLine) {
			unitLineLine = 'all';
		}
		if (unitLineLine && !companyLine) {
			companyLine = 'all';
		}
		if (companyLine && !categoryLine) {
			categoryLine = 'all';
		}
		if (categoryLine && !resourceLine) {
			resourceLine = 'all';
		}
		if (resource.length && this.menu.menu) {
			const item = this.menu.menu.find(m => m.code === 'resource');
			const labels = item.options
				.filter(o => !!~resource.indexOf(o.code))
				.map(o => o.label);
			if (labels.length) {
				titles.push('○ Магазины: ' + labels.join(', '));
			}
		}
		if (category.length && this.menu.menu) {
			const item = this.menu.menu.find(m => m.code === 'category');
			const labels = item.options
				.filter(o => !!~category.indexOf(o.code))
				.map(o => o.label);
			if (labels.length) {
				titles.push('○ Категории: ' + labels.join(', '));
			}
		}
		if (company.length && this.menu.menu) {
			const item = this.menu.menu.find(m => m.code === 'company');
			const labels = item.options
				.filter(o => !!~company.indexOf(o.code))
				.map(o => o.label);
			if (labels.length) {
				titles.push('○ Компании: ' + labels.join(', '));
			}
		}
		if (unitLine.length && this.menu.menu) {
			const item = this.menu.menu.find(m => m.code === 'unit-line');
			const labels = item.options
				.filter(o => !!~unitLine.indexOf(o.code))
				.map(o => o.label);
			if (labels.length) {
				titles.push('○ Линейки: ' + labels.join(', '));
			}
		}
		if (weight.length && this.menu.menu) {
			const item = this.menu.menu.find(m => m.code === 'WEIGHT');
			const labels = item.options
				.filter(o => !!~weight.indexOf(o.code))
				.map(o => o.label);
			if (labels.length) {
				titles.push('○ Вес: ' + labels.join(', '));
			}
		}
		if (this.filters.getCode() === 'MIXES') {
			const url = [companyLine, unitLineLine]
				.filter(d => !!d);

			return new BreadcrumbModel({
				title: titles.length ? 'Отфильтрованные' : 'Миксы табаков',
				url: url.length ? url : ['./'],
				code: 'mixes'
			});
		}
		const url = [resourceLine, categoryLine, companyLine, unitLineLine, weightLine]
			.filter(d => !!d);

		return new BreadcrumbModel({
			title: titles.length ? 'Отфильтрованные' : 'Продукты',
			url: url.length ? url : ['./'],
			code: 'products'
		});
	}
}
