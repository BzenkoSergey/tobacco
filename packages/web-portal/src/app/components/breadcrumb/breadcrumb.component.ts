import { Component } from '@angular/core';

import { Subject } from 'rxjs';

import { BreadcrumbService } from './breadcrumb.service';
import { BreadcrumbModel } from './breadcrumb.model';

@Component({
	selector: 'breadcrumb',
	templateUrl: './breadcrumb.html'
})

export class BreadcrumbComponent {
	subj: Subject<BreadcrumbModel[]>;

	constructor(service: BreadcrumbService) {
		this.subj = service.get();
	}
}
