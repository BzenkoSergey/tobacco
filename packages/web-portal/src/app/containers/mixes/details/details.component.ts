import { Component, Inject, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/platform-browser';

import { Subscription } from 'rxjs';

import { MixesRestService } from '@rest/mixes';
import { AggregatedProductDto, AggregatedProductItemDto } from '@rest/products/product-full.dto';

import { BreadcrumbService, BreadcrumbModel } from '@components/breadcrumb';
import { ParamsService, PageCode } from '@common/params.service';
import { ProductService } from '@common/products.service';
import { LinkService } from '@common/link.service';

@Component({
	templateUrl: './details.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		MixesRestService,
		ProductService
	]
})

export class DetailsComponent implements OnDestroy {
	private sub: Subscription;
	private mixCode = '';

	mix: any;
	hasAvailable = false;
	brandsNames: string[] = [];
	cost = 0;

	constructor(
		private cd: ChangeDetectorRef,
		private productService: ProductService,
		private breadcrumb: BreadcrumbService,
		private service: MixesRestService,
		private title: Title,
		private meta: Meta,
		private linkService: LinkService,
		@Inject(DOCUMENT) private document: Document,
		route: ActivatedRoute,
		paramsService: ParamsService
	) {
		paramsService.setRelatedPage(PageCode.Mixes);

		this.sub = route.params.subscribe(params => {
			paramsService.update(params);
			this.mixCode = params.mixCode;
			this.fetch();
		});
	}

	ngOnDestroy() {
		this.breadcrumb.remove('mix-detail');
		this.meta.removeTag('name="description"');
		this.meta.removeTag('name="title"');
		this.meta.removeTag('name="keywords"');
		this.meta.removeTag('property="og:title"');
		this.meta.removeTag('property="og:image"');
		this.meta.removeTag('property="og:url"');
		this.meta.removeTag('property="og:type"');
		this.meta.removeTag('property="og:description"');

		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	priceRange(items: AggregatedProductItemDto[]) {
		return this.productService.getPriceRange(items);
	}

	getItems(p: AggregatedProductDto) {
		const items = p.items.filter(i => i.available);
		if (!items.length) {
			return [];
		}
		return this.productService.getRanges(items);
	}

	private setCost() {
		const items = this.mix.recipes
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
		this.cost = cost;
	}

	private setHasAvailable() {
		this.hasAvailable = this.mix.recipes.every(r => {
			return r.unit.items.some(i => i.available);
		});
	}

	private setBrandsNames() {
		const list = [];
		this.mix.recipes.forEach(r => {
			if (!!~list.indexOf(r.unit.company.name)) {
				return;
			}
			list.push(r.unit.company.name);
		});
		this.brandsNames = list;
	}

	private defineMeta() {
		const mix = this.mix;
		const title = this.getMetaTitle();
		const url = this.document.location.origin + `/mixes/detail/${mix.readableName}`;
		const description = (mix.seo && mix.seo.description) ? mix.seo.description : (mix.description || title);

		this.linkService.updateTag({
			rel: 'canonical',
			href: url
		});
		this.meta.updateTag({
			property: 'og:url',
			content: url
		});
		this.title.setTitle(title);
		this.meta.updateTag({
			property: 'og:title',
			content: title
		});
		this.meta.updateTag({
			name: 'description',
			content: description
		});
		this.meta.updateTag({
			property: 'og:description',
			content: description
		});
		this.meta.updateTag({
			name: 'keywords',
			content: (mix.seo && mix.seo.keywords) ? mix.seo.keywords : title
		});
		this.meta.updateTag({
			property: 'og:image',
			content: 'https://res.cloudinary.com/dwkakr4wt/image/upload/origin-' + mix.image
		});
		this.meta.updateTag({
			property: 'og:type',
			content: 'article'
		});
	}

	private fetch() {
		this.service.get(this.mixCode)
			.subscribe(d => {
				this.mix = d;
				this.defineMeta();
				this.setBrandsNames();
				this.setHasAvailable();
				this.setCost();
				this.cd.markForCheck();

				this.breadcrumb.replaceAll([
					new BreadcrumbModel({
						title: this.mix.name,
						code: 'mix-detail',
						url: null,
						last: true
					})
				], 'mix-detail');
			});
	}

	private getMetaTitle() {
		let title = this.mix.seo && this.mix.seo.title;
		if (!title) {
			title = 'Микс ' + this.mix.name;
		}
		return title;
	}
}
