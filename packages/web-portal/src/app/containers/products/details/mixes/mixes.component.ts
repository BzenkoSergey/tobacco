import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { MixesRestService } from '@rest/mixes';
import { AggregatedProductDto } from '@rest/products/product-full.dto';

import { FiltersService } from './../../../filters.service';
import { LinkService } from './../../../link.service';

import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';
import { BreadcrumbModel } from '@components/breadcrumb/breadcrumb.model';

@Component({
	templateUrl: './mixes.html',
	styleUrls: ['./mixes.scss'],
	providers: [
		MixesRestService
	]
})

export class MixesComponent implements OnDestroy {
	product: AggregatedProductDto;
	loading = false;
	mixes: any[] = [];

	constructor(
		private breadcrumb: BreadcrumbService,
		private mixesRestService: MixesRestService,
		private title: Title,
		private meta: Meta,
		private filters: FiltersService,
		private linkService: LinkService,
		route: ActivatedRoute
	) {
		route.data.subscribe((data: { unit: AggregatedProductDto }) => {
			this.setUnit(data.unit);
			this.loading = false;
		});
		route.params.subscribe(params => {
			const query: any = {};
			Object.keys(params)
				.forEach(prop => {
					let value = params[prop] || '';
					value = value.split(',').filter(v => v !== 'all');
					query[prop] = value;
				});
			this.filters.push(query);
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
		this.resetOg();
	}

	fetchMixes() {
		this.mixesRestService.list({
			units: [this.product.productId]
		})
		.subscribe(d => {
			this.mixes = d.items;
		});
	}

	getMin() {
		return this.mixes.map(m => {
			return this.getCost(m);
		})
		.sort((a, b) => {
			return a[0] - b[0];
		})[0];
	}

	getCost(product: any) {
		const items = product.recipes
			.map(r => r.unit)
			.map(unit => {
				const available = unit.items
					.filter(i => i.available);

				const list = available.length ? available : unit.items;
				return list.sort((a, b) => a.price - b.price)[0];
			});

		let cost = 0;
		items.forEach(i => cost += i.price);
		return [cost, product];
	}

	private resetOg() {
		this.meta.removeTag('property="og:title"');
		this.meta.removeTag('property="og:url"');
		this.meta.removeTag('property="og:description"');
	}

	private setOg() {
		this.meta.updateTag({
			property: 'og:title',
			content: this.getMetaTitle()
		});
		this.meta.updateTag({
			property: 'og:description',
			content: this.getDescription()
		});
		this.meta.updateTag({
			property: 'og:url',
			content: window.location.origin + `/products/detail/${this.product.readableName}/mixes`
		});
	}

	private setUnit(d: AggregatedProductDto) {
		this.product = d;
		this.linkService.updateTag({
			rel: 'canonical',
			href: window.location.origin + `/products/detail/${d.readableName}/mixes`
		});
		this.title.setTitle(this.getMetaTitle());
		this.meta.updateTag({
			name: 'description',
			content: this.getDescription()
		});
		this.meta.updateTag({
			name: 'keywords',
			content: this.getMetaTitle()
		});
		this.setOg();
		this.fetchMixes();
	}

	private getDescription() {
		const productLineName = this.product.productLine ? this.product.productLine.name : '';
		const text = 'Миксы для кальяна с брендом ' + this.product.company.name + ' ' + productLineName + ' вкус ' + this.product.name + '.';
		return text;
	}

	private getMetaTitle() {
		let title = this.product.seo && this.product.seo.title;
		if (!title) {
			title = this.product.name;
			if (this.product.productLine && this.product.productLine.name) {
				title = this.product.productLine.name + ' ' + title;
			}
			if (this.product.company && this.product.company.name) {
				title = this.product.company.name + ' ' + title;
			}
			const catTitle = 'Миксы с';
			title = catTitle + ' ' + title;
		}
		return title;
	}
}
