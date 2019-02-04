import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { ImagesRestService } from '@rest/images';
import { CompaniesRestService, CompanyDto } from '@rest/companies';
import { UnitLinesRestService, UnitLineDto } from '@rest/unit-lines';
import { UnitsRestService, UnitDto } from '@rest/units';
import { PipeRestService } from '@rest/pipes';

import { NgxImageEditorComponent } from '@components/ngx-image-editor/ngx-image-editor.component';

@Component({
	templateUrl: './images.html',
	providers: [
		UnitsRestService,
		CompaniesRestService,
		UnitLinesRestService,
		ImagesRestService,
		PipeRestService
	]
})

export class UnitsDetailsImagesComponent implements OnDestroy {
	@ViewChild(NgxImageEditorComponent) imageEditor: NgxImageEditorComponent;

	private sub: Subscription;
	private itemId: string;

	private companies: CompanyDto[] = [];
	private lines: UnitLineDto[] = [];
	private original: string;

	showEditor = true;
	item = new UnitDto();
	loading = false;

	externalUrl = '';
	imageConfig = {
		ImageName: 'Some image',
		AspectRatios: ['0.84:1', '4:3', '16:9'],
		ImageUrl: '',
		ImageType: 'image/jpeg'
	};

	constructor(
		private companiesService: CompaniesRestService,
		private linesService: UnitLinesRestService,
		private imagesRestService: ImagesRestService,
		private pipesService: PipeRestService,
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
				() => {
					this.aggregate(this.itemId)
						.subscribe(
							() => this.loading = false,
							() => this.loading = false
						);
				},
				() => this.loading = false
			);
	}

	aggregate(unitId: string) {
		return this.pipesService.runSchemeOptions<any, any>(
			'PRODUCT_AGGREGATE',
			{
				data: {
					productId: unitId
				}
			}
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

	imageEditer(file: File) {
		const original = {
			unitIds: [this.itemId],
			files: [this.original]
		};
		const d2 = {
			unitIds: [this.itemId],
			files: [this.imageEditor.croppedImage]
		};
		if (!this.externalUrl) {
				this.imagesRestService.upload(d2)
					.subscribe(d => {
						this.item.logo = d.paths[0];
						this.imagesRestService.resize(d.paths)
							.subscribe(() => {
								this.imagesRestService.sync(d.paths)
									.subscribe(() => {
										this.save();
									});
							});
					});
			return;
		}
		this.imagesRestService.uploadOrigin(original)
			.subscribe(() => {
				this.imagesRestService.upload(d2)
					.subscribe(d => {
						this.item.logo = d.paths[0];
						this.imagesRestService.resize(d.paths)
							.subscribe(() => {
								this.imagesRestService.sync(d.paths)
									.subscribe(() => {
										this.save();
									});
							});
					});
			});
	}

	updateImageUrl() {
		this.showEditor = false;
		setTimeout(() => {
			this.showEditor = true;
		}, 100);
		this.getDataUri(this.getImageUrl(), (dataUrl) => {
			console.log(dataUrl);
			this.original = dataUrl;
		});
	}

	makeR(str: string) {
		return str.toLowerCase()
		.replace(/ /g, '-')
		.replace(/[^\w-]+/g, '');
	}

	private getImageUrl() {
		let url = this.externalUrl || this.item.logo;
		if (url.includes('http')) {
			url = 'http://' + window.location.hostname + ':3330/scheme/code/IMG_EXTERNAL_DOWNLOAD/options?loadImage=true&path=' + url;
		} else {
			// http://localhost:3330/scheme/code/IMG_DOWNLOAD_ORIGIN/options?path=darkside_soft_cookie.jpg&isFile=true
			// url = 'http://' + window.location.hostname + ':3330/scheme/code/IMG_DOWMLOAD/options?path=' + this.item.logo + '&isFile=true';
			url = 'http://' + window.location.hostname + ':3330/scheme/code/IMG_DOWNLOAD_ORIGIN/options?path=' + this.item.logo + '&isFile=true';
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

	private getDataUri(url, callback) {
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
}
