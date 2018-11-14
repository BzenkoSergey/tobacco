import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material';

import { MarketProductDto, MarketProductsRestService } from '@rest/market-products';
import { ProductDto, ProductsRestService } from '@rest/products';
import { MarketDto, MarketsRestService } from '@rest/markets';

import { CompaniesRestService } from '@rest/companies';
import { CategoriesRestService } from '@rest/categories';
import { ProductLinesRestService } from '@rest/product-lines';
import { ProductAttributesRestService } from '@rest/product-attributes';

import { ImagesRestService } from '@rest/images';

@Component({
	templateUrl: './images.html',
	providers: [
		ImagesRestService
	]
})
export class ImagesComponent {
	items: string[] = [];

	constructor(
		private service: ImagesRestService
	) {
		this.fetch();
	}

	sync(imagePath: string) {
		this.service.sync(imagePath)
			.subscribe(d => {
				console.log(d);
			});
	}

	syncAll() {
		this.service.syncAll()
			.subscribe(d => {
				console.log(d);
			});
	}

	private fetch() {
		this.service.list()
			.subscribe(d => this.items = d);
	}
}
