import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CompanyDto, CompaniesRestService } from '@rest/companies';

@Component({
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [
		CompaniesRestService
	]
})

export class OverviewComponent {
	items: CompanyDto[] = [];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: CompaniesRestService
	) {
		this.fetch();
	}

	create() {
		const item = new CompanyDto();
		item.name = 'Placeholder';

		this.service.create(item)
			.subscribe(d => {
				this.router.navigate(['./../../', d._id.$oid], {
					relativeTo: this.route
				});
			});
	}

	fetch() {
		this.service.list()
			.subscribe(list => {
				this.items = list;
			});
	}
}
