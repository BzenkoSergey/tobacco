import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MenuService } from './../menu.service';

export type FilterItem = {
	label: string;
	code: string;
	dependOn?: any;
	isTitle?: boolean;
};

@Component({
	selector: 'filter-items',
	templateUrl: './filter-items.html',
	styleUrls: ['./filter-items.scss']
})

export class FilterItemsComponent implements OnChanges {
	@Output() selected = new EventEmitter<string[]>();
	@Input() items: FilterItem[] = [];
	@Input() selectedCodes: string[] = [];
	@Input() code: string;
	@Input() mixes = false;
	@Input() allSelected = new Map<string, string[]>();

	urls = new Map<string, string[]>();
	displayed: FilterItem[] = [];
	search = '';
	menu: any;
	groups: any = [];
	queriesToLink: any = {};

	constructor(
		route: ActivatedRoute,
		menuService: MenuService
	) {
		route.queryParams.subscribe(p => {
			if (p.page) {
				this.queriesToLink = {
					page: 0
				};
				return;
			}
			this.queriesToLink = {};
		});
		menuService.get()
			.subscribe(d => this.menu = d);
	}

	ngOnChanges() {
		if (!this.selectedCodes) {
			this.selectedCodes = [];
		} else {
			this.selectedCodes = this.selectedCodes.concat([]);
		}

		this.urls = new Map<string, string[]>();
		this.items.forEach(i => {
			const u = this.genPath(i);
			this.urls.set(i.code, u);
		});
		this.defineDisplayed();
	}

	select(i: FilterItem) {
		const status = !!~this.selectedCodes.indexOf(i.code);
		if (!status) {
			this.selectedCodes.push(i.code);
		} else {
			this.selectedCodes = this.selectedCodes.filter(c => c !== i.code);
		}
		this.emitSelected();
	}

	defineDisplayed(e?: KeyboardEvent) {
		if (e) {
			this.search = (e.target as HTMLInputElement).value;
		}

		this.groups = [];

		const items = this.items
			.filter(i => {
				const line = i.label;
				return !!line.match(new RegExp(this.search, 'i'));
			})
			.sort((a, b) => {
				// return a.label.localeCompare(b.label);
				if (a.label < b.label) { return -1; }
				if (a.label > b.label) { return 1; }
				return 0;
			});

		items.forEach(it => {
			if (it.dependOn || !this.menu) {
				const itemCode = it.dependOn.item;
				const itemOption = it.dependOn.option;
				const item = this.menu.menu.find(i => i.code === itemCode);
				const groupOption = item.options.find(i => i.code === itemOption);
				if (!groupOption) {
					return;
				}
				let group = this.groups.find(g => g.code === itemOption);
				if (!group) {
					group = {
						code: itemOption,
						label: groupOption.label,
						items: []
					};
					this.groups.push(group);
				}
				group.items.push(it);
				return;
			}
			let group = this.groups.find(g => g.code === 'default');
			if (!group) {
				group = {
					code: 'default',
					label: '',
					items: []
				};
				this.groups.push(group);
			}
			group.items.push(it);
		});
		this.displayed = items;
	}

	isSelected(itemCode: string) {
		const selected = this.allSelected.get(this.code) || [];
		return !!~selected.indexOf(itemCode);
	}

	private emitSelected() {
		this.selected.emit(this.selectedCodes);
	}

	private genPath(i: any): string[] {
		let resource = (this.allSelected.get('resource') || []).concat([]);
		let category = (this.allSelected.get('category') || []).concat([]);
		let company = (this.allSelected.get('company') || []).concat([]);
		let unitLine = (this.allSelected.get('unit-line') || []).concat([]);
		let weight = (this.allSelected.get('WEIGHT') || []).concat([]);

		const selected = this.isSelected(i.code);

		if (this.code === 'resource') {
			if (selected) {
				resource = resource.filter(r => r !== i.code);
			} else {
				resource.push(i.code);
			}
		}
		if (this.code === 'category') {
			if (selected) {
				category = category.filter(r => r !== i.code);
			} else {
				category.push(i.code);
			}
		}
		if (this.code === 'company') {
			if (selected) {
				company = company.filter(r => r !== i.code);
			} else {
				company.push(i.code);
			}
		}
		if (this.code === 'unit-line') {
			if (selected) {
				unitLine = unitLine.filter(r => r !== i.code);
			} else {
				unitLine.push(i.code);
			}
		}
		if (this.code === 'WEIGHT') {
			if (selected) {
				weight = weight.filter(r => r !== i.code);
			} else {
				weight.push(i.code);
			}
		}

		if (this.code === 'company' && selected) {
			unitLine = unitLine.filter(ul => {
				const lines = this.menu.menu.find(i => i.code === 'unit-line');
				if (!lines || !lines.options) {
					return false;
				}
				const f = lines.options.find(i => i.code === ul);
				if (f) {
					if (!~company.indexOf(f.dependOn.option)) {
						return false;
					}
				}
				return true;
			});
		}

		let resourceLine = this.isNotEmptyArray(resource) ? resource.join(',') : '';
		let categoryLine = this.isNotEmptyArray(category) ? category.join(',') : '';
		let companyLine = this.isNotEmptyArray(company) ? company.join(',') : '';
		let unitLineLine = this.isNotEmptyArray(unitLine) ? unitLine.join(',') : '';
		const weightLine = this.isNotEmptyArray(weight) ? weight.join(',') : '';


		if (weightLine && !unitLineLine) {
			unitLineLine = 'all';
		}
		if (!companyLine) {
			unitLineLine = 'all';
		}
		if (unitLineLine && !companyLine) {
			companyLine = 'all';
		}
		if (companyLine && !categoryLine) {
			categoryLine = 'all';
		}
		if (categoryLine && !resourceLine) {
			resourceLine = 'all';
		}
		if (this.mixes) {
			return ['/mixes', companyLine, unitLineLine]
				.filter(d => !!d);
		}
		return ['/products', resourceLine, categoryLine, companyLine, unitLineLine, weightLine]
			.filter(d => !!d);
	}

	private isNotEmptyArray(d: any) {
		return Array.isArray(d) && d.length;
	}
}
