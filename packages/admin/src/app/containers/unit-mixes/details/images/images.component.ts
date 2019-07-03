import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, of, Subject } from 'rxjs';

import { UnitsRestService, UnitDto } from '@rest/units';
import { UnitLinesRestService, UnitLineDto } from '@rest/unit-lines';
import { CompaniesRestService, CompanyDto } from '@rest/companies';
import { UnitMixesRestService, UnitMixDto, UnitMixRecipe } from '@rest/unit-mixes';
import { PipeRestService } from '@rest/pipes';
import { ImagesRestService } from '@rest/images';

@Component({
	templateUrl: './images.html',
	providers: [
		UnitsRestService,
		UnitMixesRestService,
		CompaniesRestService,
		UnitLinesRestService,
		PipeRestService,
		ImagesRestService
	]
})

export class DetailsImagesComponent implements OnDestroy {
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
		private imagesRestService: ImagesRestService,
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

	saveImage(img: string) {
		const d2 = {
			files: [img],
			names: ['image_' + this.item.readableName]
		};
		this.imagesRestService.uploadMix(d2)
			.subscribe(d3 => {
				this.item.image = d3.paths[0];
				this.imagesRestService.resizeMix(d3.paths)
					.subscribe(() => {
						this.imagesRestService.sync(d3.paths)
							.subscribe(() => {
								this.save(false);
							});
					});
				console.log(d3);
			});
	}

	imageEditer() {
		this.getDataUri(this.item.image2, (d) => {
			const d2 = {
				files: [d],
				names: ['image2_' + this.item.readableName]
			};
			this.imagesRestService.uploadMix(d2)
				.subscribe(d3 => {
					this.item.image2 = d3.paths[0];
					this.imagesRestService.resizeMix(d3.paths)
						.subscribe(() => {
							this.imagesRestService.sync(d3.paths)
								.subscribe(() => {
									this.save(false);
								});
						});
					console.log(d3);
				});
		});
	}

	isExternal(url: string) {
		return url.includes('http');
	}

	private getDataUri(url, callback) {

		if (this.isExternal(url)) {
			url = 'http://' + window.location.hostname + ':3330/scheme/code/IMG_EXTERNAL_DOWNLOAD/options?loadImage=true&path=' + url;
		}
		const xhr = new XMLHttpRequest();
		xhr.onload = function() {
			const reader = new FileReader();
			reader.onloadend = function() {
				callback(reader.result);
			};
			reader.readAsDataURL(xhr.response);
		};
		xhr.open('GET', url);
		xhr.responseType = 'blob';
		xhr.send();
	}

	getData() {
		return this.item.recipes.map(r => {
			const unit = this.units.find(u => u._id === r.unit);
			const line = this.lines.find(u => u.code === r.line);
			const company = this.companies.find(u => u.code === r.company);
			return {
				label: unit ? unit.name : '',
				sublabel: company ? (company.name + ' ' + (line ? line.name : '')) : '',
				value: r.percentage,
				color: r.color
			};
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	handleData() {
		this.item.recipes.map(r => this.getInits(r));
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
					console.log(d);
					this.handleData();
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
