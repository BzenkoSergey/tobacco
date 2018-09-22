import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MarketDto, MarketsRestService } from '@rest/markets';

@Component({
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [
		MarketsRestService
	]
})

export class OverviewComponent {
	items: MarketDto[] = [];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: MarketsRestService
	) {
		this.fetch();
	}

	create() {
		const market = new MarketDto();
		market.name = 'Placeholder';

		this.service.create(market)
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
