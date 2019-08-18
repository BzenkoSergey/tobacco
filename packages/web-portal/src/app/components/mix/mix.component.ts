import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { ProductsRestService } from '@rest/products';
import { SearchRestService } from '@rest/search';

@Component({
	selector: 'mix',
	templateUrl: './mix.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
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
