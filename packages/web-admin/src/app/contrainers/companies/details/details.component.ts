import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { CompanyDto, CompaniesRestService } from '@rest/companies';


@Component({
	templateUrl: './details.html',
	styleUrls: ['./details.scss'],
	providers: [
		CompaniesRestService
	]
})

export class DetailsComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	loading = false;
	item = new CompanyDto();

	constructor(
		private service: CompaniesRestService,
		route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.companyId;
			this.fetch();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	save() {
		this.loading = true;
		this.service.update(this.item)
			.subscribe(
				d => {
					this.loading = false;
					this.item = d;
				},
				e => this.loading = false
			);
	}

	private fetch() {
		this.loading = true;
		this.service.get(this.itemId)
			.subscribe(
				d => {
					this.loading = false;
					this.item = d;
				},
				e => this.loading = false
			);
	}
}
