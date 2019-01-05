import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, combineLatest } from 'rxjs';

import { UnitAttributesRestService, UnitAttributeDto, UnitAttributeValueDto, UnitAttributeType } from '@rest/unit-attributes';
import { MappingKeyDto } from '@rest/shared';

@Component({
	templateUrl: './unit-attributes.html',
	providers: [
		UnitAttributesRestService
	]
})

export class UnitAttributesComponent implements OnDestroy {
	private sub: Subscription;
	attributes: UnitAttributeDto[] = [];
	items: UnitAttributeDto[] = [
		// new UnitAttributeDto({
		// 	_id: 'sadasdasd',
		// 	name: 'We',
		// 	code: 'WE',
		// 	type: UnitAttributeType.LIST,
		// 	values: [
		// 		new UnitAttributeValueDto({
		// 			value: '100uhy',
		// 			code: '100UHY',
		// 			mappingKeys: [
		// 				new MappingKeyDto({
		// 					value: 'sadasdasd'
		// 				}),
		// 				new MappingKeyDto({
		// 					value: 'sadasdasd1212'
		// 				}),
		// 				new MappingKeyDto({
		// 					value: 'sadasdasd121222'
		// 				})
		// 			]
		// 		}),
		// 		new UnitAttributeValueDto({
		// 			value: '120uhy',
		// 			code: '120UHY',
		// 			mappingKeys: [
		// 				new MappingKeyDto({
		// 					value: 'sadasdasd'
		// 				})
		// 			]
		// 		})
		// 	]
		// }),
		// new UnitAttributeDto({
		// 	_id: 'sadasdasd12',
		// 	name: 'We2',
		// 	code: 'WE2',
		// 	type: UnitAttributeType.LIST,
		// 	values: [
		// 		new UnitAttributeValueDto({
		// 			value: '100uhy',
		// 			code: '100UHY',
		// 			mappingKeys: [
		// 				new MappingKeyDto({
		// 					value: 'sadasdasd'
		// 				})
		// 			]
		// 		})
		// 	]
		// })
	];
	itemId: string;
	valueId: string;
	item: UnitAttributeDto;

	constructor(
		private router: Router,
		private service: UnitAttributesRestService,
		route: ActivatedRoute
	) {
		this.fetch();
		this.sub = route.queryParams.subscribe(p => {
			this.itemId = p.itemId;
			this.valueId = p.valueId;
			this.defineItem();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	search(query?: string) {
		if (!query) {
			this.items = this.attributes;
			return;
		}
		this.items = this.attributes.filter(c => {
			return new RegExp(query, 'ig').test(c.name);
		});
	}

	removeValue(d: UnitAttributeValueDto) {
		this.item.values = this.item.values.filter(v => v !== d);
	}

	createValue() {
		this.item.values.unshift(new UnitAttributeValueDto());
	}

	createItem() {
		const d = new UnitAttributeDto();
		d.name = '';
		this.select(d);
	}

	selectValue(d: UnitAttributeValueDto) {
		this.router.navigate([], {
			queryParams: {
				valueId: d.code
			},
			queryParamsHandling: 'merge'
		});
	}

	select(d: UnitAttributeDto) {
		this.item = d;
		if (d._id) {
			this.router.navigate([], {
				queryParams: {
					itemId: d._id
				},
				queryParamsHandling: 'merge'
			});
		}
	}

	create(d) {
		this.service.create(d)
			.subscribe(s => {
				this.fetch();
				d._id = s;
				this.select(d);
			});
	}

	remove(d) {
		this.service.remove(d._id)
			.subscribe(() => {
				this.fetch();
				this.select(null);
			});
	}

	update(d: UnitAttributeDto) {
		this.service.update(d._id, d)
			.subscribe(r => {
				this.fetch();
				this.select(d);
			});
	}

	save(d: UnitAttributeDto) {
		if (d._id) {
			this.update(d);
			return;
		}
		this.create(d);
	}

	private fetch() {
		this.service.list()
			.subscribe(d => {
				this.attributes = d.concat([]);
				this.items = d;
				this.defineItem();
			});
	}

	private defineItem() {
		if (!this.itemId) {
			return;
		}
		this.item = this.attributes.find(i => i._id === this.itemId);
	}
}
