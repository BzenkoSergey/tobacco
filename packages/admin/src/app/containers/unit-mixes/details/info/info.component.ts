import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, of, Subject } from 'rxjs';

import { UnitsRestService, UnitDto } from '@rest/units';
import { UnitLinesRestService, UnitLineDto } from '@rest/unit-lines';
import { CompaniesRestService, CompanyDto } from '@rest/companies';
import { UnitMixesRestService, UnitMixDto, UnitMixRecipe } from '@rest/unit-mixes';
import { PipeRestService } from '@rest/pipes';

@Component({
	templateUrl: './info.html',
	providers: [
		UnitsRestService,
		UnitMixesRestService,
		CompaniesRestService,
		UnitLinesRestService,
		PipeRestService
	]
})

export class DetailsInfoComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	saving = false;
	item = new UnitMixDto();
	companies: CompanyDto[] = [];
	lines: UnitLineDto[] = [];
	map = new Map<string, UnitDto[]>();
	units: UnitDto[] = [];

	pieData = [];

	constructor(
		private unitsRestService: UnitsRestService,
		private companiesRestService: CompaniesRestService,
		private unitLinesRestService: UnitLinesRestService,
		private service: UnitMixesRestService,
		private pipesService: PipeRestService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.mixId;
			this.fetchCompanies();
			this.fetchLines();
			if (this.itemId === 'new') {
				return;
			}
			this.fetch();
		});
	}

	genName() {
		const units = [];
		this.item.recipes.forEach(r => {
			units.push(this.units.find(u => u._id === r.unit));
		});
		let name = '';
		units.forEach((u, i) => {
			if (i) {
				name += ' ';
			}
			name += u.translate;
		});

		this.item.name = name;
	}

	genReadableName() {
		const units = [];
		const companies = [];
		this.item.recipes.forEach(r => {
			if (!~companies.indexOf(r.company)) {
				companies.push(r.company);
			}
			units.push(this.units.find(u => u._id === r.unit));
		});
		let name = '';
		if (companies.length === 1) {
			name = companies[0] + '_';
		}
		units.forEach((u, i) => {
			if (i) {
				name += '_';
			}
			name += this.makeAll(u, companies.length !== 1);
		});

		this.item.readableName = name;
	}

	makeAll(item: any, no = true) {
		const company = this.companies.find(c => c._id === item.company);
		const productLine = this.lines.find(pl => pl._id === item.productLine);

		let fileName = '';
		if (company && no) {
			fileName += this.makeR(company.name);
		}
		if (productLine) {
			fileName += (fileName ? '_' : '') + this.makeR(productLine.name);
		}
		fileName +=  (fileName ? '_' : '') + this.makeR(item.name);
		return fileName;
	}

	makeR(str: string) {
		return str.toLowerCase()
			.replace(/ /g, '_')
			.replace(/[^\w-]+/g, '');
	}

	aggregate() {
		this.pipesService.runSchemeOptions<any, any>(
			'MOVE_MIX',
			this.item
		)
		.subscribe();
	}

	getData() {
		return this.item.recipes.map(r => {
			const unit = this.units.find(u => u._id === r.unit);
			const line = this.lines.find(u => u.code === r.line);
			const company = this.companies.find(u => u.code === r.company);
			return {
				label: unit ? unit.name : '',
				sublabel: company ? (company.name + ' ' + (line ? line.name : '')) : '',
				value: r.percentage
			};
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	addRecipe() {
		const d = new UnitMixRecipe();
		this.item.recipes.push(d);
	}

	removeRecipe(recipe: UnitMixRecipe) {
		this.item.recipes = this.item.recipes.filter(r => r !== recipe);
	}

	getInits(recipe: UnitMixRecipe) {
		const code = recipe.company + recipe.line;
		const u = this.map.get(code);
		if (u) {
			return of(u);
		}
		const subj = new Subject<UnitDto[]>();
		const q: any = {};
		if (recipe.company) {
			const company = this.companies.find(c => c.code === recipe.company);
			q.company = company ? company._id : '';
		}
		if (recipe.line) {
			const line = this.lines.find(l => l.code === recipe.line);
			q.productLine = line ? line._id : '';
		}
		this.unitsRestService.list(q)
		.subscribe(d => {
			this.map.set(code, d);
			this.units = this.units.concat(d);
			this.pieData = this.getData();
			subj.next(d);
			subj.complete();
		});
		return subj;
	}

	getLines(recipe: UnitMixRecipe) {
		const company = this.companies.find(c => c.code === recipe.company);
		if (!company) {
			return [];
		}
		return this.lines.filter(l => {
			return l.company === company._id;
		});
	}

	save(invalid: boolean) {
		if (invalid) {
			return;
		}
		this.saving = true;
		if (!this.item._id) {
			this.service.create(this.item)
				.subscribe(
					(id) => {
						this.router.navigate(['./../../../../', id.toString()], {
							relativeTo: this.route
						});
						this.saving = false;
					},
					() => this.saving = false
				);
			return;
		}
		this.service.update(this.itemId, this.item)
			.subscribe(
				() => this.saving = false,
				() => this.saving = false
			);
	}

	private fetch() {
		this.service.get(this.itemId)
			.subscribe(
				d => {
					this.item = d;
				}
			);
	}

	private fetchCompanies() {
		this.companiesRestService.list()
			.subscribe(d => {
				this.companies = d;
				this.pieData = this.getData();
			});
	}

	private fetchLines() {
		this.unitLinesRestService.list()
			.subscribe(d => {
				this.lines = d;
				this.pieData = this.getData();
			});
	}
}
