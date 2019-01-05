import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { CompaniesRestService, CompanyDto } from '@rest/companies';
import { UnitLinesRestService, UnitLineDto } from '@rest/unit-lines';
import { UnitsRestService, UnitDto } from '@rest/units';
import { NgxImageEditorComponent } from '@components/ngx-image-editor/ngx-image-editor.component';

@Component({
	templateUrl: './images.html',
	providers: [
		UnitsRestService,
		CompaniesRestService,
		UnitLinesRestService
	]
})

export class UnitsDetailsImagesComponent implements OnDestroy {
	@ViewChild(NgxImageEditorComponent) imageEditor: NgxImageEditorComponent;

	private sub: Subscription;
	private itemId: string;

	private companies: CompanyDto[] = [];
	private lines: UnitLineDto[] = [];

	item = new UnitDto();
	loading = false;

	externalUrl = '';
	imageConfig = {
		ImageName: 'Some image',
		AspectRatios: ['4:3', '16:9'],
		ImageUrl: '',
		ImageType: 'image/jpeg'
	};

	constructor(
		private companiesService: CompaniesRestService,
		private linesService: UnitLinesRestService,
		private service: UnitsRestService,
		route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.unitId;
			this.fetch();
		});
		this.fetchCompanies();
		this.fetchLines();
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	save() {
		this.loading = true;
		this.service.update(this.itemId, this.item)
			.subscribe(
				() => this.loading = false,
				() => this.loading = false
			);
	}

	getConfigs() {
		const company = this.companies.find(c => c._id === this.item.company);
		const productLine = this.lines.find(pl => pl._id === this.item.productLine);

		let fileName = '';
		if (company) {
			fileName += this.makeR(company.name);
		}
		if (productLine) {
			fileName += '-' + this.makeR(productLine.name);
		}
		fileName += '-' + this.makeR(this.item.name);
		const g = this.item.logo.match(/\.[A-z]{1,}$/g);
		if (g) {
			fileName += g[0];
		}

		this.imageConfig.ImageName = encodeURI(fileName);
		this.imageConfig.ImageUrl = this.getImageUrl();
		return this.imageConfig;
	}

	makeR(str: string) {
		return str.toLowerCase()
		.replace(/ /g, '-')
		.replace(/[^\w-]+/g, '');
	}

	private getImageUrl() {
		let url = this.externalUrl || this.item.logo;
		if (url.includes('http')) {
			url = 'http://' + window.location.hostname + ':3330/images/external/' + url;
		} else {
			url = 'http://' + window.location.hostname + ':3330/images/' + this.item._id;
		}
		return url;
	}

	private fetch() {
		this.loading = true;
		this.service.get(this.itemId)
			.subscribe(
				d => {
					this.item = d;
					this.loading = false;
				},
				() => this.loading = false
			);
	}

	private fetchCompanies() {
		this.companiesService.list()
			.subscribe(d => this.companies = d);
	}

	private fetchLines() {
		this.linesService.list()
			.subscribe(d => this.lines = d);
	}
}
