import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DeviceService } from '@common/device.service';
import { ParamsService, PageCode } from '@common/params.service';

import { AggregatedProductDto } from '@rest/products';

import { BreadcrumbService, BreadcrumbModel } from '@components/breadcrumb';

import { DetailsService } from './details.service';

@Component({
	templateUrl: './details.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class DetailsComponent implements OnDestroy {
	unit: AggregatedProductDto;
	screenWidth = this.deviceService.width();

	constructor(
		private cd: ChangeDetectorRef,
		private deviceService: DeviceService,
		private breadcrumb: BreadcrumbService,
		private detailsService: DetailsService,
		paramsService: ParamsService,
		route: ActivatedRoute
	) {
		paramsService.setRelatedPage(PageCode.Products);

		route.data.subscribe((data: { unit: AggregatedProductDto }) => {
			this.setUnit(data.unit);
		});

		route.params.subscribe(params => {
			paramsService.update(params);
		});
	}

	ngOnDestroy() {
		this.breadcrumb.remove('product-detail');
		this.detailsService.resetCommonMeta();
	}

	private setUnit(d: AggregatedProductDto) {
		this.unit = d;
		this.detailsService.setCommonMeta(d);

		this.breadcrumb.replaceAll([
			new BreadcrumbModel({
				title: this.detailsService.genTitle(d),
				code: 'product-detail',
				url: null,
				last: true
			})
		], 'product-detail');
		this.cd.markForCheck();
	}
}
