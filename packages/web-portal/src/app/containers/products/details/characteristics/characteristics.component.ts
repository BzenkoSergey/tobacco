import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { DeviceService } from '@common/device.service';
import { AggregatedProductDto } from '@rest/products';
import { BreadcrumbService, BreadcrumbModel } from '@components/breadcrumb';

import { DetailsService } from './../details.service';

@Component({
	templateUrl: './characteristics.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class CharacteristicsComponent implements OnDestroy {
	private sub: Subscription;
	private titlePrefix = 'Характеристики ✔';

	screenWidth = this.deviceService.width();
	unit: AggregatedProductDto;

	constructor(
		private deviceService: DeviceService,
		private detailsService: DetailsService,
		private breadcrumb: BreadcrumbService,
		route: ActivatedRoute
	) {
		this.sub = route.data.subscribe((data: { unit: AggregatedProductDto }) => {
			const unit = data.unit;
			this.unit = unit;
			this.detailsService.setMetaTitle(unit, null, this.titlePrefix);
			this.detailsService.setMetaUrl(unit);
			this.detailsService.setMetaUrl(unit, 'characteristics');
			this.detailsService.setMetaDescription(unit, this.getDescription());
			this.detailsService.setMetaKeywords(unit, this.getMetaTitle());
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
		this.detailsService.resetMeta([
			'og:title',
			'og:url',
			'og:description'
		]);
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	isLink(value: string) {
		return !!~value.indexOf('http');
	}

	private getDescription() {
		let title = this.getMetaTitle();
		this.unit.fields
			.filter(f => !this.isLink(f.value))
			.slice(0, 3)
			.forEach(f => {
				title += ' ✔ ' + f.label + ': ' + f.value;
			});
		return title;
	}

	private getMetaTitle() {
		return this.detailsService.genMetaTitle(this.unit, this.titlePrefix);
	}
}
