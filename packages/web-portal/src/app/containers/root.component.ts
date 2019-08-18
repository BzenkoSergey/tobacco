import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { Subscription, combineLatest } from 'rxjs';

import { BreadcrumbService, BreadcrumbModel } from '@components/breadcrumb';

import { DeviceService } from '@common/device.service';
import { ParamsService, PageCode } from '@common/params.service';
import { MenuService } from '@common/menu.service';
import { GAService } from '@common/ga.service';

import { Utils } from './utils';

@Component({
	selector: 'root',
	templateUrl: './root.html',
	styleUrls: ['./root.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class RootComponent implements OnDestroy {
	private subs: Subscription[] = [];
	private queriesMap = new Map<string, string[]>();
	private menu: any;
	private isMixesPage = false;
	private isMobile = this.deviceService.isLgMobile();

	search = '';

	constructor(
		private deviceService: DeviceService,
		private router: Router,
		private breadcrumb: BreadcrumbService,
		gaService: GAService,
		paramsService: ParamsService,
		menuService: MenuService,
		meta: Meta,
		route: ActivatedRoute
	) {
		gaService.init();

		meta.updateTag({
			property: 'og:site_name',
			content: 'Hoogle.com.ua'
		});

		this.subs.push(
			combineLatest(menuService.get(), paramsService.get())
				.subscribe(d => {
					this.menu = d[0];

					this.isMixesPage = paramsService.getRelatedPage() === PageCode.Mixes;
					this.queriesMap = paramsService.getMap();

					breadcrumb.remove('products');
					breadcrumb.remove('mixes');
					const code = this.isMixesPage ? 'mixes' : 'products';
					breadcrumb.replaceAll(this.genBreadcrumb(), code);
				})
		);

		this.subs.push(route.queryParams
			.subscribe(p => {
				this.search = p.search || '';
			}));
	}

	ngOnDestroy() {
		this.subs.forEach(s => s.unsubscribe());
	}

	performSearch(text: string) {
		const path = Utils.genPathUrl(this.queriesMap, this.isMixesPage);
		this.router.navigate(path, {
			queryParams: {
				page: 0,
				search: text
			},
			queryParamsHandling: 'merge'
		});
	}

	private genBreadcrumb(): BreadcrumbModel[] {
		const list = Utils.genBreadcrumbs(this.queriesMap, this.menu, this.isMixesPage, this.isMobile);
		const removeHome = list.length > 2;

		if (this.isMobile && removeHome) {
			this.breadcrumb.remove('home');
		} else {
			this.breadcrumb.replaceAll([
				new BreadcrumbModel({
					title: 'Главная',
					url: ['/'],
					code: 'home',
					icon: 'home'
				})
			], 'home');
		}
		return list;
	}
}
