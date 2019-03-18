import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { MixesRestService } from '@rest/mixes';
import { AggregatedProductDto } from '@rest/products/product-full.dto';

import { FiltersService } from './../../filters.service';

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
	unit: AggregatedProductDto;
	hasMixes = false;
	screenWidth = screen.width;

	constructor(
		private breadcrumb: BreadcrumbService,
		private filters: FiltersService,
		private mixesRestService: MixesRestService,
		private meta: Meta,
		route: ActivatedRoute
	) {
		route.data.subscribe((data: { unit: AggregatedProductDto }) => {
			this.setUnit(data.unit);
			this.fetchMixes();
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
		this.breadcrumb.remove('product-detail');
		this.resetOg();
	}

	private resetOg() {
		this.meta.removeTag('property="og:image"');
		this.meta.removeTag('property="og:type"');
		this.meta.removeTag('name="description"');
		this.meta.removeTag('name="title"');
		this.meta.removeTag('name="keywords"');
	}

	private setOg() {
		this.meta.updateTag({
			property: 'og:image',
			content: 'https://res.cloudinary.com/dwkakr4wt/image/upload/lg-' + this.unit.logo
		});
		this.meta.updateTag({
			property: 'og:type',
			content: 'product'
		});
	}

	private setUnit(d: AggregatedProductDto) {
		this.unit = d;
		this.setOg();

		this.breadcrumb.replaceAll([
			new BreadcrumbModel({
				title: this.getTitle(),
				code: 'product-detail',
				url: null,
				last: true
			})
		], 'product-detail');
	}

	private getTitle() {
		let title = this.unit.name;
		if (this.unit.productLine && this.unit.productLine.name) {
			title = this.unit.productLine.name + ' ' + title;
		}
		if (this.unit.company && this.unit.company.name) {
			title = this.unit.company.name + ' ' + title;
		}
		return '' + title;
	}

	fetchMixes() {
		this.mixesRestService.list({
			units: [this.unit.productId]
		})
		.subscribe(d => {
			this.hasMixes = !!d.items.length;
		});
	}
}
