import { Component, Input, OnChanges } from '@angular/core';

import { CustomFieldsRestService, CustomFieldsDto, CustomFieldDto, EntityType } from '@rest/custom-fields';
import { CompaniesRestService } from '@rest/companies';
import { UnitLinesRestService } from '@rest/unit-lines';

@Component({
	selector: 'custom-fields',
	templateUrl: './custom-fields.html',
	providers: [
		CustomFieldsRestService,
		CompaniesRestService,
		UnitLinesRestService
	]
})
export class CustomFieldsComponent implements OnChanges {
	@Input() ownerCode: string;
	@Input() ownerType: EntityType;
	@Input() parentId: string;
	@Input() parentCode: string;
	@Input() parentType: EntityType;

	items: CustomFieldsDto[] = [];
	parents: CustomFieldsDto[] = [];

	constructor(
		private service: CustomFieldsRestService,
		private companiesRestService: CompaniesRestService,
		private unitLinesRestService: UnitLinesRestService
	) {}

	ngOnChanges() {
		this.items = [];
		this.parents = [];
		this.fetchOwn();

		if (Array.isArray(this.parentId)) {
			return;
		}
		if (this.parentId && this.parentType === 'company') {
			this.fetchCompany(this.parentId);
		}
		if (this.parentId && this.parentType === 'unit-line') {
			this.fetchUnitLine(this.parentId);
		}
	}

	onlyInherance(fields: CustomFieldDto[]) {
		return fields.filter(f => f.inheritance);
	}

	setIgnore(field: CustomFieldDto) {
		if (!this.items.length) {
			return false;
		}
		const item = this.items[0];
		if (this.isIgnored(field)) {
			item.ingoreFields = item.ingoreFields.filter(i => i !== field.code);
			return;
		}
		item.ingoreFields.push(field.code);
	}

	isIgnored(field: CustomFieldDto) {
		if (!this.items.length) {
			return false;
		}
		return this.items[0].ingoreFields.includes(field.code);
	}

	add() {
		const item = new CustomFieldsDto();
		item.ownerCode = this.ownerCode;
		item.ownerType = this.ownerType;

		item.parentCode = this.parentCode;
		item.parentType = this.parentType;
		this.service.create(item)
			.subscribe(() => {
				this.items = [];
				this.fetchOwn();
			});
	}

	addField(item: CustomFieldsDto) {
		const field = new CustomFieldDto();
		item.fields.push(field);
	}

	removeField(item: CustomFieldsDto, field: CustomFieldDto) {
		item.fields = item.fields.filter(f => f !== field);
	}

	save(item: CustomFieldsDto) {
		this.service.update(item._id, item)
			.subscribe(() => {
				this.items = [];
				this.fetchOwn();
			});
	}

	private addParent(item: CustomFieldsDto) {
		const has = this.parents.some(p => {
			return p.ownerCode === item.ownerCode && p.ownerType === item.ownerType;
		});
		if (has) {
			return;
		}
		this.parents.push(item);
	}

	private fetchOwn() {
		if (!this.ownerCode || !this.ownerType) {
			return;
		}
		this.fetch({
			ownerCode: this.ownerCode,
			ownerType: this.ownerType
		}).subscribe(d => {
			const item = d[0];
			if (!item) {
				return;
			}
			this.items.push(item);
			if (item.parentCode && item.parentType) {
				this.fetchParent(item.parentCode, item.parentType);
			}
		});
	}

	private fetchParent(parentCode: string, parentType: EntityType) {
		if (!parentCode || !parentType) {
			return;
		}
		const has = this.parents.some(p => {
			return p.ownerCode === parentCode && p.ownerType === parentType;
		});
		if (has) {
			return;
		}
		this.fetch({
			ownerCode: parentCode,
			ownerType: parentType
		}).subscribe(d => {
			const parent = d[0];
			if (!parent) {
				return;
			}
			this.addParent(parent);
			if (parent.parentCode && parent.parentType) {
				this.fetchParent(parent.parentCode, parent.parentType);
			}
		});
	}

	private fetch(query: any) {
		return this.service.list(query);
	}

	private fetchCompany(companyId: string) {
		this.companiesRestService.get(companyId)
			.subscribe(d => {
				this.parentCode = d.code;
				this.fetchParent(d.code, 'company');
			});
	}

	private fetchUnitLine(unitLineId: string) {
		this.unitLinesRestService.get(unitLineId)
			.subscribe(d => {
				this.parentCode = d.code;
				this.fetchParent(d.code, 'unit-line');
			});
	}
}
