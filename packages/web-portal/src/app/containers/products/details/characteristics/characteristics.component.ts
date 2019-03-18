import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { AggregatedProductDto } from '@rest/products/product-full.dto';

import { FiltersService } from './../../../filters.service';
import { LinkService } from './../../../link.service';

import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';
import { BreadcrumbModel } from '@components/breadcrumb/breadcrumb.model';

@Component({
	templateUrl: './characteristics.html',
	styleUrls: ['./characteristics.scss']
})

export class CharacteristicsComponent implements OnDestroy {
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
				title: 'Характеристики',
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

	isLink(value: string) {
		return !!~value.indexOf('http');
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
			content: window.location.origin + `/products/detail/${this.product.readableName}/characteristics`
		});
	}

	private setUnit(d: AggregatedProductDto) {
		this.product = d;
		this.linkService.updateTag({
			rel: 'canonical',
			href: window.location.origin + `/products/detail/${d.readableName}/characteristics`
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
			const catTitle = 'Характеристики ✔';
			const catTitle2 = this.product.categories.map(c => c.name).join(' ');
			title = catTitle + ' ' + catTitle2 + ' ' + title;
		}
		return title;
	}

	private getDescription() {
		let title = this.getMetaTitle();
		this.product.fields
			.slice(0, 3)
			.forEach(f => {
				title += ' ✔ ' + f.label + ': ' + f.value;
			});
		return title;
	}
}
