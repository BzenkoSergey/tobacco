import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { map } from 'rxjs/operators';

import { MixesRestService } from '@rest/mixes';
import { ReviewsRestService, ReviewDto, ReviewType } from '@rest/reviews';
import { AggregatedProductDto, AggregatedProductItemDto } from '@rest/products/product-full.dto';

import { FiltersService } from './../../../filters.service';
import { LinkService } from './../../../link.service';

@Component({
	templateUrl: './info.html',
	styleUrls: ['./info.scss'],
	providers: [
		MixesRestService,
		ReviewsRestService
	]
})

export class InfoComponent implements OnDestroy {
	product: AggregatedProductDto;
	productsTotal = 0;
	productsQueries: any = null;
	loading = false;
	mixes: any[] = [];
	reviews: ReviewDto[] = [];
	commonRating = 0;
	screenWidth = screen.width;

	constructor(
		private reviewsRestService: ReviewsRestService,
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

			if (data.unit.reviews) {
				this.fetchReviews();
			}
			this.fetchProducts();
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
	}

	ngOnDestroy() {
		this.resetOg();
	}

	getReviews() {
		this.reviewsRestService.list({
			entityId: this.product.productId,
			type: ReviewType.UNIT,
			itemsPerPage: this.product.reviews
		})
		.subscribe(d => {
			let rating = 0;
			d.items.forEach(i => {
				rating = rating + (+i.rating);
			});
			this.commonRating = rating / d.items.length;
		});
	}

	fetchMixes() {
		this.mixesRestService.list({
			units: [this.product.productId]
		})
		.subscribe(d => {
			this.mixes = d.items;
		});
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
			.filter(i => {
				return i.available;
			})
			.sort((a, b) => {
				return a.price - b.price;
			})
			.slice(0, 3);
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
			content: (this.product.seo && this.product.seo.description) ? this.product.seo.description : this.getMetaTitle()
		});
		this.meta.updateTag({
			property: 'og:url',
			content: window.location.origin + `/products/detail/${this.product.readableName}`
		});
	}

	private setUnit(d: AggregatedProductDto) {
		this.product = d;
		this.linkService.updateTag({
			rel: 'canonical',
			href: window.location.origin + `/products/detail/${d.readableName}`
		});
		this.title.setTitle(this.getMetaTitle());
		this.meta.updateTag({
			name: 'description',
			content: (d.seo && d.seo.description) ? d.seo.description : this.getMetaTitle()
		});
		this.meta.updateTag({
			name: 'keywords',
			content: (d.seo && d.seo.keywords) ? d.seo.keywords : ''
		});
		this.setOg();
		this.fetchMixes();
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
			const catTitle = this.product.categories.map(c => c.name).join(' ');
			title = catTitle ? catTitle + ' ' + title : title;
		}
		return title;
	}

	private fetchReviews() {
		this.reviewsRestService.list({
			entityId: this.product.productId,
			type: ReviewType.UNIT,
			itemsPerPage: this.product.reviews
		}).subscribe(d => {
			this.reviews = d.items.slice(0, 3);

			let rating = 0;
			d.items.forEach(i => {
				rating = rating + (+i.rating);
			});
			this.commonRating = rating / d.items.length;
		});
	}

	private fetchProducts() {
		const r = this.product.name.split(' / ');
		const search = r[0] +  '|' + r[1];
		this.productsQueries = {
			or: true,
			search: search,
			company: [this.product.company.code],
			exclude: [this.product.readableName],
			itemsPerPage: 5,
			categories: this.product.categories.map(c => c.code)
		};
	}
}
