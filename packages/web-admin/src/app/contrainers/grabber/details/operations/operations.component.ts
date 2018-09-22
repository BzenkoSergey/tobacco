import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { GrabberMappingAttributeDto, GrabberTransform, GrabberInputDto } from '@magz/common';
import { MarketsRestService, MarketDto } from '@rest/markets';
import { GrabberRestService, ResultRow } from '@rest/grabber';

@Component({
	templateUrl: './operations.html',
	styleUrls: ['./operations.scss'],
	providers: [
		MarketsRestService,
		GrabberRestService
	]
})

export class OperationsComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	loading = false;
	item = new MarketDto();
	results: ResultRow[] = [];

	constructor(
		private service: MarketsRestService,
		private grabberService: GrabberRestService,
		route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.marketId;
			this.fetch();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	performGrabber() {
		this.grabberService.create(this.item.grabber)
			.subscribe(
				r => {
					this.results = r;
				},
				e => console.error(e)
			);
	}

	addTransform(attr: GrabberMappingAttributeDto) {
		const transform: [GrabberTransform, any] = [GrabberTransform.BOOLEANIFY, ''];
		attr.transforms.unshift(transform);
	}

	addAttribute() {
		const attr = new GrabberMappingAttributeDto();
		this.item.grabber.mapping.attributes.unshift(attr);
	}

	save() {
		this.loading = true;
		this.service.update(this.item)
			.subscribe(
				d => {
					this.loading = false;
					this.item = d;
				},
				e => this.loading = false
			);
	}

	private fetch() {
		this.loading = true;
		this.service.get(this.itemId)
			.subscribe(
				d => {
					this.loading = false;
					this.item = d;
				},
				e => this.loading = false
			);
	}
}
