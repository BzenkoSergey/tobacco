import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { MenuRestService } from '@rest/menu';

@Injectable()
export class MenuService {
	private menu: any;

	constructor(private service: MenuRestService) {}

	get() {
		if (this.menu) {
			return of(this.menu);
		}

		return this.service.list()
			.pipe(
				tap(d => {
					this.menu = d;
				})
			);
	}
}
