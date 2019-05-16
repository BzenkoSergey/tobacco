import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

@Component({
	templateUrl: './process.html'
})

export class ProcessComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;
	private schemeId: string;

	constructor(
		route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.processId;
			this.schemeId = params.schemeId;
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}
}
