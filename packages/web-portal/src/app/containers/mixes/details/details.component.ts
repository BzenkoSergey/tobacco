import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { MixesRestService } from '@rest/mixes';
import { AggregatedProductDto, AggregatedProductItemDto } from '@rest/products/product-full.dto';

import { FiltersService } from './../../filters.service';
import { LinkService } from './../../link.service';

import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';
import { BreadcrumbModel } from '@components/breadcrumb/breadcrumb.model';

@Component({
	templateUrl: './details.html',
	styleUrls: ['./details.scss'],
	providers: [
		MixesRestService
	]
})

export class DetailsComponent implements OnDestroy {
	private unitCode = '';

	product: any;
	loading = false;

	constructor(
		private breadcrumb: BreadcrumbService,
		private service: MixesRestService,
		private title: Title,
		private meta: Meta,
		private filters: FiltersService,
		private linkService: LinkService,
		route: ActivatedRoute
	) {
		this.filters.setCode('MIXES');
		route.params.subscribe(params => {
			const query: any = {};
			Object.keys(params)
				.forEach(prop => {
					let value = params[prop] || '';
					value = value.split(',').filter(v => v !== 'all');
					query[prop] = value;
				});
			this.filters.push(query);

			this.unitCode = params.unitCode;
			this.fetch();
		});
	}

	ngOnDestroy() {
		this.breadcrumb.remove('mix-detail');
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

	getCost() {
		const items = this.product.recipes
			.map(r => r.unit)
			.map(unit => {
				const available = unit.items
					.filter(i => i.available);

				const list = available.length ? available : unit.items;
				return list.sort((a, b) => a.price - b.price)[0];
			});
		let cost = 0;
		items.forEach(i => cost += i.price);
		return cost;
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
		this.product.recipes.every(r => {
			return r.unit.items.some(i => i.available);
		});
	}

	getItems(p: AggregatedProductDto) {
		const map = new Map<string, AggregatedProductItemDto[]>();

		const items = p.items.filter(i => i.available);
		if (!items.length) {
			return [];
		}
		items.forEach(pm => {
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
			if (!items.length) {
				return {
					attr: null,
					prices: '',
					pricesList: []
				};
			}
			let prices = '';
			const pricesList = [];
			if (items.length > 1) {
				pricesList.push(items[0].price);
				pricesList.push(items[items.length - 1].price);
				prices += items[0].price;
				prices += '-' + items[items.length - 1].price;
			} else {
				pricesList.push(items[0].price);
				prices += items[0].price;
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

	getBrandsNames() {
		const list = [];
		this.product.recipes.forEach(r => {
			if (!!~list.indexOf(r.unit.company.name)) {
				return;
			}
			list.push(r.unit.company.name);
		});
		return list;
	}

	private resetOg() {
		this.meta.removeTag('name="description"');
		this.meta.removeTag('name="title"');
		this.meta.removeTag('name="keywords"');
		this.meta.removeTag('property="og:title"');
		this.meta.removeTag('property="og:image"');
		this.meta.removeTag('property="og:url"');
		this.meta.removeTag('property="og:type"');
		this.meta.removeTag('property="og:description"');
	}

	private setOg() {
		this.meta.updateTag({
			property: 'og:title',
			content: this.getMetaTitle()
		});
		this.meta.updateTag({
			property: 'og:description',
			content: (this.product.seo && this.product.seo.description) ? this.product.seo.description : (this.product.description || this.getMetaTitle())
		});
		this.meta.updateTag({
			property: 'og:image',
			content: 'https://res.cloudinary.com/dwkakr4wt/image/upload/origin-' + this.product.image
		});
		this.meta.updateTag({
			property: 'og:url',
			content: window.location.origin + `/mixes/detail/${this.product.readableName}`
		});
		this.meta.updateTag({
			property: 'og:type',
			content: 'article'
		});
	}

	private fetch() {
		this.loading = true;
		this.service.get(this.unitCode)
			.subscribe(
				d => {
					this.product = d;
					this.linkService.updateTag({
						rel: 'canonical',
						href: window.location.origin + `/mixes/detail/${d.readableName}`
					});
					this.title.setTitle(this.getMetaTitle());
					this.meta.updateTag({
						name: 'description',
						content: (d.seo && d.seo.description) ? d.seo.description : (this.product.description || this.getMetaTitle())
					});
					this.meta.updateTag({
						name: 'keywords',
						content: (d.seo && d.seo.keywords) ? d.seo.keywords : this.getMetaTitle()
					});
					this.setOg();

					this.breadcrumb.replaceAll([
						new BreadcrumbModel({
							title: this.getTitle(),
							code: 'mix-detail',
							url: null,
							last: true
						})
					], 'mix-detail');
					this.loading = false;
				},
				() => this.loading = false
			);
	}

	private getMetaTitle() {
		let title = this.product.seo && this.product.seo.title;
		if (!title) {
			title = 'Микс ' + this.product.name;
		}
		return title;
	}

	private getTitle() {
		return this.product.name;
	}
}
