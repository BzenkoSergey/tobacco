import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UnitsRestService, UnitDto } from '@rest/units';
import { CompaniesRestService, CompanyDto } from '@rest/companies';
import { UnitMixesRestService, UnitMixDto } from '@rest/unit-mixes';
import { UnitLinesRestService, UnitLineDto } from '@rest/unit-lines';

import { ConfirmComponent } from '@components/confirm/confirm.component';

@Component({
	templateUrl: './overview.html',
	providers: [
		UnitMixesRestService,
		CompaniesRestService,
		UnitLinesRestService,
		UnitsRestService
	]
})

export class OverviewComponent {
	items: UnitMixDto[] = [];
	units: UnitDto[] = [];
	lines: UnitLineDto[] = [];
	companies: CompanyDto[] = [];
	loading = false;

	constructor(
		private modalService: NgbModal,
		private unitsRestService: UnitsRestService,
		private unitLinesRestService: UnitLinesRestService,
		private companiesRestService: CompaniesRestService,
		private service: UnitMixesRestService
	) {
		this.fetch();
	}

	performRemove(item: UnitMixDto) {
		const modalRef = this.modalService.open(ConfirmComponent, {
			size: 'sm'
		});

		modalRef.componentInstance.result.subscribe(status => {
			if (!status) {
				return;
			}
			this.remove(item)
				.subscribe(
					() => {
						this.fetch();
					}
				);
		});
	}

	getUnitName(id: string) {
		const d = this.units.find(u => u._id === id);
		return d ? d.name : '';
	}

	getLineName(id: string) {
		const d = this.lines.find(u => u.code === id);
		return d ? d.name : '';
	}

	getCompanyName(id: string) {
		const d = this.companies.find(u => u.code === id);
		return d ? d.name : '';
	}

	private fetch() {
		this.service.list()
			.subscribe(
				d => {
					this.loading = false;
					this.items = d;
					this.getUnits();
					this.getLines();
					this.getCompanies();
				},
				() => {
					this.loading = false;
				}
			);
	}

	private remove(d: UnitMixDto) {
		return this.service.remove(d._id);
	}

	private getUnits() {
		const ids = [];
		this.items.forEach(i => {
			i.recipes.forEach(r => {
				if (r.unit && !this.units.some(u => u._id === r.unit)) {
					ids.push(r.unit);
				}
			});
		});
		if (!ids.length) {
			return;
		}
		this.unitsRestService.list({
			'_id': {
				$in: ids.map(id => '$' + id)
			}
		})
		.subscribe(d => {
			this.units = this.units.concat(d);
		});
	}

	private getLines() {
		const ids = [];
		this.items.forEach(i => {
			i.recipes.forEach(r => {
				const line = this.lines.find(u => u.code === r.line);
				if (r.line && !line) {
					ids.push(r.line);
				}
			});
		});
		if (!ids.length) {
			return;
		}
		this.unitLinesRestService.list({
			'code': {
				$in: ids.map(id => id)
			}
		})
		.subscribe(d => {
			this.lines = this.lines.concat(d);
		});
	}

	private getCompanies() {
		const ids = [];
		this.items.forEach(i => {
			i.recipes.forEach(r => {
				const company = this.companies.find(u => u.code === r.company);
				if (r.company && !company) {
					ids.push(r.company);
				}
			});
		});
		if (!ids.length) {
			return;
		}
		this.companiesRestService.list({
			'code': {
				$in: ids.map(id => id)
			}
		})
		.subscribe(d => {
			this.companies = this.companies.concat(d);
		});
	}
}
