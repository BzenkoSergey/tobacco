import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { DeviceService } from '@common/device.service';
import { MixesRestService } from '@rest/mixes';
import { AggregatedProductDto } from '@rest/products';
import { ProductService } from '@common/products.service';

import { BreadcrumbService, BreadcrumbModel } from '@components/breadcrumb';

import { DetailsService } from './../details.service';

@Component({
	templateUrl: './mixes.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		MixesRestService
	]
})

export class MixesComponent implements OnDestroy {
	private sub: Subscription;

	screenWidth = this.deviceService.width();
	unit: AggregatedProductDto;
	mixes: any[] = [];
	cheaper: any;
	cheaperPrice = 0;

	constructor(
		private cd: ChangeDetectorRef,
		private deviceService: DeviceService,
		private productService: ProductService,
		private detailsService: DetailsService,
		private breadcrumb: BreadcrumbService,
		private mixesRestService: MixesRestService,
		route: ActivatedRoute
	) {
		this.sub = route.data.subscribe((data: { unit: AggregatedProductDto }) => {
			const unit = data.unit;
			this.unit = unit;
			this.detailsService.setMetaTitle(unit, this.getMetaTitle());
			this.detailsService.setMetaUrl(unit, 'mixes');
			this.detailsService.setMetaDescription(unit, this.getDescription());
			this.detailsService.setMetaKeywords(unit, this.getMetaTitle());
			this.fetchMixes();
		});

		this.breadcrumb.add([
			new BreadcrumbModel({
				title: 'Миксы',
				code: 'product-detail-add',
				url: null,
				last: true
			})
		]);
	}

	ngOnDestroy() {
		this.breadcrumb.remove('product-detail-add');
		this.detailsService.resetMeta([
			'og:title',
			'og:url',
			'og:description'
		]);
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	private fetchMixes() {
		this.mixesRestService.list({
			units: [this.unit.productId]
		})
		.subscribe(d => {
			this.mixes = d.items;
			this.setCheaper();
			this.cd.markForCheck();
		});
	}

	private setCheaper() {
		const cheaper = this.mixes.map(m => {
			return this.getCheaperItems(m);
		})
		.sort((a, b) => {
			return a[0] - b[0];
		})[0];

		this.cheaper = cheaper[1];
		this.cheaperPrice = cheaper[0];
	}

	private getCheaperItems(mix: any) {
		const items = mix.recipes
			.map(r => r.unit)
			.map(unit => {
				const item = this.productService.sortByCheaperItems(unit.items, true)[0];
				if (item) {
					return item;
				}
				return this.productService.sortByCheaperItems(unit.items, false)[0];
			})
			.filter(i => !!i);

		let cost = 0;
		items.forEach(i => cost += i.price);
		return [cost, mix];
	}

	private getDescription() {
		const productLineName = this.unit.productLine ? this.unit.productLine.name : '';
		const productNameLine = productLineName ? ' ' + productLineName : '';
		const text = 'Миксы для кальяна с брендом ' + this.unit.company.name + productNameLine + ' вкус ' + this.unit.name + '.';
		return text;
	}

	private getMetaTitle() {
		return this.detailsService.genMetaTitle(this.unit, 'Миксы с', true);
	}
}
