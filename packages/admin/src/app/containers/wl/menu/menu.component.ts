import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { CategoriesRestService, CategoryDto } from '@rest/categories';
import { UnitAttributesRestService, UnitAttributeDto } from '@rest/unit-attributes';
import { UnitLinesRestService, UnitLineDto } from '@rest/unit-lines';
import { CompaniesRestService, CompanyDto } from '@rest/companies';
import { ResourcesRestService, ResourceDto } from '@rest/resources';
import { WlRestService, WlDto } from '@rest/wl';

import { MenuItem } from './menu-item.enum';

@Component({
	templateUrl: './menu.html',
	styleUrls: ['./menu.scss'],
	providers: [
		WlRestService,
		CategoriesRestService,
		UnitAttributesRestService,
		UnitLinesRestService,
		CompaniesRestService,
		ResourcesRestService
	]
})

export class MenuComponent {
	loading = false;
	saving = false;
	item = new WlDto();
	types = MenuItem.list;

	categories: CategoryDto[] = [];
	lines: UnitLineDto[] = [];
	attributes: UnitAttributeDto[] = [];
	companies: CompanyDto[] = [];
	resources: ResourceDto[] = [];

	constructor(
		private categoriesRestService: CategoriesRestService,
		private attributesRestService: UnitAttributesRestService,
		private linesRestService: UnitLinesRestService,
		private companiesRestService: CompaniesRestService,
		private resourcesRestService: ResourcesRestService,
		private service: WlRestService
	) {
		this.fetch();
		this.fetchCategories();
		this.fetchCompanies();
		this.fetchLines();
		this.fetchAttributes();
		this.fetchResources();
		window['ff'] = this;
	}

	selectAll(menuItem: any, options: any[]) {
		options.forEach(o => {
			this.changeItemOption(menuItem, o);
		});
	}

	changeItemOption(menuItem: any, option: any) {
		const selected = this.isSelectedOption(menuItem, option);
		if (selected) {
			menuItem.options = menuItem.options.filter(o => {
				return option.code !== o.code;
			});
		} else {
			menuItem.options.push({
				code: option.code,
				label: option.name || option.label || option.value,
				logo: option.logo
			});
		}
	}

	isSelectedOption(menuItem: any, option: any) {
		return menuItem.options.some(o => {
			return o.code === option.code;
		});
	}

	getList(type: MenuItem, menuItem: any) {
		if (type === MenuItem.CATEGORY) {
			return this.categories;
		}
		if (type === MenuItem.ATTRIBUTE) {
			const attr = this.attributes.find(a => a.code === menuItem.code);
			return attr ? attr.values : [];
		}
		if (type === MenuItem.COMPANY) {
			return this.companies;
		}
		if (type === MenuItem.LINE) {
			return this.lines;
		}
		if (type === MenuItem.RESOURCE) {
			return this.resources;
		}
		return [];
	}

	add() {
		this.item.menu.push({
			code: '',
			label: '',
			type: MenuItem.ATTRIBUTE,
			dependOn: {
				item: '',
				option: ''
			},
			options: []
		});
	}

	remove(menuItem: any) {
		this.item.menu = this.item.menu.filter(m => {
			return m !== menuItem;
		});
		this.save();
	}

	save() {
		this.saving = true;
		let sub: Observable<any>;
		this.prepare();
		if (this.item._id) {
			sub = this.update();
		} else {
			sub = this.create();
		}
		sub.subscribe(
			() => {
				this.saving = false;
				this.fetch();
			},
			() => this.saving = false
		);
	}

	prepare() {
		this.item.menu.forEach(i => {
			if (i.type === MenuItem.LINE) {
				i.options.forEach(o => {
					const line = this.lines.find(l => l.code === o.code);
					const company = this.companies.find(c => c._id === line.company);
					o.dependOn = {
						item: 'company',
						option: company.code
					};
				});
			}
		});
	}

	private create() {
		return this.service.create(this.item);
	}

	private update() {
		return this.service.update(this.item._id, this.item);
	}

	private fetch() {
		this.loading = true;
		this.service.get()
			.subscribe(
				d => {
					console.log(d);
					this.item = d;
					this.loading = false;
				},
				() => this.loading = false
			);
	}

	private fetchCategories() {
		this.categoriesRestService.list()
			.subscribe(d => this.categories = d);
	}

	private fetchCompanies() {
		this.companiesRestService.list()
			.subscribe(d => this.companies = d);
	}

	private fetchLines() {
		this.linesRestService.list()
			.subscribe(d => this.lines = d);
	}

	private fetchAttributes() {
		this.attributesRestService.list()
			.subscribe(d => this.attributes = d);
	}

	private fetchResources() {
		this.resourcesRestService.list()
			.subscribe(d => this.resources = d);
	}
}
