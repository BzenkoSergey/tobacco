import { Component, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { SearchRestService } from '@rest/search';
import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';

import { MixesRestService } from '@rest/mixes';
import { MenuService } from './../menu.service';
import { FiltersService } from './../filters.service';

@Component({
	templateUrl: './home.html',
	styleUrls: ['./home.scss'],
	providers: [
		SearchRestService,
		MixesRestService
	]
})
export class HomeComponent implements OnDestroy {
	menu: any;
	mixes: any[] = [];
	tobaccoQueries = {
		available: true,
		categories: ['tobacco'],
		page: 0,
		itemsPerPage: 3,
	};
	coalQueries = {
		available: true,
		categories: ['coal'],
		page: 0,
		itemsPerPage: 7,
	};
	bowlQueries = {
		available: true,
		categories: ['bowl'],
		page: 0,
		itemsPerPage: 7,
	};
	openedId: string|null = null;
	search = '';

	constructor(
		breadcrumb: BreadcrumbService,
		private title: Title,
		private meta: Meta,
		filters: FiltersService,
		service: MixesRestService,
		private menuService: MenuService
	) {
		filters.push({});
		breadcrumb.remove('products');
		this.menuService.get()
			.subscribe(menu => {
				this.menu = menu;
			});

		this.title.setTitle('Hoogle.com.ua кальянный навигатор');

		this.meta.updateTag({
			property: 'og:title',
			content: 'Hoogle.com.ua кальянный навигатор'
		});
		this.meta.updateTag({
			property: 'og:url',
			content: window.location.href
		});

		service.list({
			page: 0,
			itemsPerPage: 4
		})
		.subscribe(d => {
			this.mixes = d.items;
		});
	}

	ngOnDestroy() {
		this.meta.removeTag('property="og:title"');
		this.meta.removeTag('property="og:url"');
	}

	tooggleItems(id: string) {
		if (id === this.openedId) {
			this.openedId = null;
			return false;
		}
		this.openedId = id;
	}

	getCategories() {
		if (!this.menu) {
			return [];
		}
		return this.menu.menu.find(o => o.code === 'company').options;
	}
}
