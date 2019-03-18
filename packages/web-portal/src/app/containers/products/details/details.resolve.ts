import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { ProductsRestService } from '@rest/products';
import { AggregatedProductDto } from '@rest/products/product-full.dto';

@Injectable()
export class DetailsResolver implements Resolve<AggregatedProductDto> {
	constructor(
		private service: ProductsRestService
	) {}

	resolve(route: ActivatedRouteSnapshot): Observable<AggregatedProductDto> | Observable<never> {
		const unitCode = route.paramMap.get('unitCode');
		return this.service.get(unitCode);
	}
}
