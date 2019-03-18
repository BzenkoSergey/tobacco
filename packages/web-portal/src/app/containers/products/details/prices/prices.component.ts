import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { AggregatedProductDto, AggregatedProductItemDto } from '@rest/products/product-full.dto';

import { FiltersService } from './../../../filters.service';
import { LinkService } from './../../../link.service';

import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';
import { BreadcrumbModel } from '@components/breadcrumb/breadcrumb.model';

@Component({
	templateUrl: './prices.html',
	styleUrls: ['./prices.scss']
})

export class PricesComponent implements OnDestroy {
	product: AggregatedProductDto;
	loading = false;

	constructor(
		private breadcrumb: BreadcrumbService,
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
				title: 'Цены',
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

	priceRange(items: AggregatedProductItemDto[]) {
		if (!items.length) {
			return [];
		}
		const highPrice = items
			.sort((a, b) => {
				return b.price - a.price;
			})[0].price;

		const lowPrice = items
			.sort((a, b) => {
				return a.price - b.price;
			})[0].price;

		return [lowPrice, highPrice];
	}

	sortItems(items: AggregatedProductItemDto[]) {
		return items
			.sort((a, b) => {
				return a.price - b.price;
			})
			.sort((a, b) => {
				return (b.available ? 1 : 0) - (a.available ? 1 : 0);
			});
	}

	available() {
		return this.product.items.some(i => i.available);
	}

	getItems(p: AggregatedProductDto) {
		const map = new Map<string, AggregatedProductItemDto[]>();

		p.items.forEach(pm => {
			const pa = pm.productAttributes[0];
			if (pa) {
				let list2 = map.get(pa.value) || [];
				list2.push(pm);
				list2 = list2
					.sort((a, b) => {
						return a.price - b.price;
					});
				map.set(pa.value, list2);
			}
		});
		const info = [];
		if (!map.size) {
			if (!p.items.length) {
				return {
					attr: null,
					prices: '',
					pricesList: []
				};
			}
			let prices = '';
			const pricesList = [];
			if (p.items.length > 1) {
				pricesList.push(p.items[0].price);
				pricesList.push(p.items[p.items.length - 1].price);
				prices += p.items[0].price;
				prices += '-' + p.items[p.items.length - 1].price;
			} else {
				pricesList.push(p.items[0].price);
				prices += p.items[0].price;
			}
			info.push({
				attr: null,
				prices: prices,
				pricesList: pricesList
			});
			return info;
		}

		map.forEach((mps, key) => {
			let prices = '';
			const pricesList = [];
			if (mps.length > 1) {
				pricesList.push(mps[0].price);
				pricesList.push(mps[mps.length - 1].price);
				prices += mps[0].price;
				prices += '-' + mps[mps.length - 1].price;
			} else {
				pricesList.push(mps[0].price);
				prices += mps[0].price;
			}

			info.push({
				attr: key,
				prices: prices,
				pricesList: pricesList
			});
		});
		return info;
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
			content: window.location.origin + `/products/detail/${this.product.readableName}/prices`
		});
	}

	private setUnit(d: AggregatedProductDto) {
		this.product = d;
		this.linkService.updateTag({
			rel: 'canonical',
			href: window.location.origin + `/products/detail/${d.readableName}/prices`
		});
		this.title.setTitle(this.getMetaTitle());
		this.meta.updateTag({
			name: 'description',
			content: this.getDescription()
		});
		this.meta.updateTag({
			name: 'keywords',
			content: (d.seo && d.seo.keywords) ? d.seo.keywords : ''
		});
		this.setOg();
	}

	private getDescription() {
		const items = this.priceRange(this.product.items);
		return 'Цены от интернет-магазинов на ' + this.getTitle() + ' ✔ от ' + items[0] + ' до ' + items[1] + 'грн';
	}

	private getMetaTitle() {
		return 'Цены на ' + this.getTitle();
	}

	private getTitle() {
		let title = this.product.seo && this.product.seo.title;
		if (!title) {
			title = this.product.name;
			if (this.product.productLine && this.product.productLine.name) {
				title = this.product.productLine.name + ' ' + title;
			}
			if (this.product.company && this.product.company.name) {
				title = this.product.company.name + ' ' + title;
			}
			const catTitle = this.product.categories.map(c => c.name).join(' ');
			title =  catTitle + ' ' + title;
		}
		return title;
	}
}
