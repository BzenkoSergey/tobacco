import { Component, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';

import { ProductsRestService } from '@rest/products';
import { AggregatedProductDto, AggregatedProductItemDto } from '@rest/products/product-full.dto';
import { SearchRestService } from '@rest/search';

@Component({
	selector: 'mix',
	templateUrl: './mix.html',
	providers: [
		ProductsRestService,
		SearchRestService
	]
})

export class MixComponent {
	@Input() absolute = false;
	@Input() brand = '';
	@Input() d: any = {};

	getUrl() {
		if (this.absolute) {
			return ['/mixes' + (this.brand ? '/' + this.brand : ''), 'detail', this.d.readableName];
		}
		return ['./detail' + (this.brand ? '/' + this.brand : ''), this.d.readableName];
	}
}
