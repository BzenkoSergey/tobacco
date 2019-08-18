import { Component, Inject, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/platform-browser';

import { DeviceService } from '@common/device.service';
import { ParamsService } from '@common/params.service';
import { MenuService } from '@common/menu.service';
import { SearchRestService } from '@rest/search';
import { MixesRestService } from '@rest/mixes';
import { BreadcrumbService } from '@components/breadcrumb';

@Component({
	templateUrl: './home.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		SearchRestService,
		MixesRestService
	]
})
export class HomeComponent implements OnDestroy {
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
		itemsPerPage: this.getColsCount()
	};
	bowlQueries = {
		available: true,
		categories: ['bowl'],
		page: 0,
		itemsPerPage: this.getColsCount()
	};
	mixes: any[] = [];
	brands: any[] = [];
	openedId: string|null = null;

	constructor(
		private cd: ChangeDetectorRef,
		private title: Title,
		private meta: Meta,
		private deviceService: DeviceService,
		private mixesRestService: MixesRestService,
		private menuService: MenuService,
		@Inject(DOCUMENT) private document: Document,
		breadcrumb: BreadcrumbService,
		paramsService: ParamsService
	) {
		paramsService.update({});
		breadcrumb.remove('products');
		this.defineMeta();
		this.fetch();
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

	private fetch() {
		this.menuService.get()
			.subscribe(menu => {
				this.brands = menu.menu.find(o => o.code === 'company').options;
				this.cd.markForCheck();
			});

		this.mixesRestService
			.list({
				page: 0,
				itemsPerPage: 4
			})
			.subscribe(d => {
				this.mixes = d.items;
				this.cd.markForCheck();
			});
	}

	private defineMeta() {
		this.title.setTitle('Hoogle.com.ua кальянный навигатор');
		this.meta.updateTag({
			property: 'og:title',
			content: 'Hoogle.com.ua кальянный навигатор'
		});
		this.meta.updateTag({
			property: 'og:url',
			content: this.document.location.href
		});
	}

	private getColsCount() {
		const width = this.deviceService.width();
		if (width > 923) {
			return 7;
		}
		if (width > 754) {
			return 6;
		}
		if (width > 602) {
			return 5;
		}
		if (width > 534) {
			return 4;
		}
		return 3;
	}
}
