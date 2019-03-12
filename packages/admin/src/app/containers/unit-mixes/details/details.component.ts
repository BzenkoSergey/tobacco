import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, of, Subject } from 'rxjs';

import { UnitsRestService, UnitDto } from '@rest/units';
import { UnitLinesRestService, UnitLineDto } from '@rest/unit-lines';
import { CompaniesRestService, CompanyDto } from '@rest/companies';
import { UnitMixesRestService, UnitMixDto, UnitMixRecipe } from '@rest/unit-mixes';
import { PipeRestService } from '@rest/pipes';

@Component({
	templateUrl: './details.html',
	providers: [
		UnitsRestService,
		UnitMixesRestService,
		CompaniesRestService,
		UnitLinesRestService,
		PipeRestService
	]
})

export class DetailsComponent implements OnDestroy {
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

	getData() {
		return this.item.recipes.map(r => {
			const unit = this.units.find(u => u._id === r.unit);
			const line = this.lines.find(u => u._id === r.line);
			const company = this.companies.find(u => u._id === r.company);
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
			q.company = recipe.company;
		}
		if (recipe.line) {
			q.productLine = recipe.line;
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
		return this.lines.filter(l => {
			return l.company === recipe.company;
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
						this.router.navigate(['./../../', id.toString()], {
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
