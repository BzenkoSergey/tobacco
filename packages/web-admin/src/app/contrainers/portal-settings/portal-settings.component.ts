import { Component } from '@angular/core';

import { PortalFilterDto, PortalSettingsDto, PortalSettingsRestService } from '@rest/portal-settings';
import { CategoriesRestService, CategoryDto } from '@rest/categories';
import { ProductAttributeDto, ProductAttributesRestService } from '@rest/product-attributes';

@Component({
	templateUrl: './portal-settings.html',
	styleUrls: ['./portal-settings.scss'],
	providers: [
		PortalSettingsRestService,
		CategoriesRestService,
		ProductAttributesRestService
	]
})

export class PortalSettingsComponent {
	categories: CategoryDto[] = [];
	productLines: ProductAttributeDto[] = [];
	item = new PortalSettingsDto();

	constructor(
		private categoriesService: CategoriesRestService,
		private productAttributesService: ProductAttributesRestService,
		private service: PortalSettingsRestService
	) {
		this.fetchProductCategories();
		this.fetchCategories();
		this.fetch();
	}

	addFilter() {
		const d = new PortalFilterDto();
		this.item.filters.unshift(d);
	}

	removeFilter(d: PortalFilterDto) {
		this.item.filters = this.item.filters.filter(i => {
			return i !== d;
		});
	}

	create() {
		this.service.create(this.item)
			.subscribe(s => {
				this.item = s;
			});
	}

	update() {
		this.service.update(this.item)
			.subscribe(s => {
				this.item = s;
			});
	}

	save() {
		if (this.item._id) {
			this.update();
			return;
		}
		this.create();
	}

	private fetchProductCategories() {
		this.productAttributesService.list()
			.subscribe(d => this.productLines = d);
	}

	private fetchCategories() {
		this.categoriesService.list()
			.subscribe(d => {
				this.categories = d;
			});
	}

	private fetch() {
		this.service.list()
			.subscribe(d => {
				this.item = d[0] ? d[0] : this.item;
			});
	}
}
