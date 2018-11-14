import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { GrabberMappingAttributeDto, GrabberTransform } from '@magz/common';
import { MarketsRestService, MarketDto } from '@rest/markets';

@Component({
	templateUrl: './details.html',
	styleUrls: ['./details.scss'],
	providers: [
		MarketsRestService
	]
})

export class DetailsComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	loading = false;
	item = new MarketDto();

	constructor(
		private service: MarketsRestService,
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

	addTransform(attr: GrabberMappingAttributeDto) {
		const transform: [GrabberTransform, any] = [GrabberTransform.BOOLEANIFY, ''];
		attr.transforms.unshift(transform);
	}

	addLink() {
		this.item.grabber.ignoreLinks.push('');
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
