import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subject, combineLatest, Observable, of } from 'rxjs';

import { PipesRestService } from '@rest/pipes';

@Component({
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [PipesRestService]
})

export class PipesOverviewComponent implements OnInit {
	columns = ['label', 'id', 'actions'];
	items: any[] = [];

	constructor(private service: PipesRestService) {}

	ngOnInit() {
		this.fetch();
	}

	create() {
		this.service.createScheme(
			{
				options: null,
				type: 'LINE',
				label: 'Placeholder',
				children: []
			}
		)
		.subscribe(() => {
			this.fetch();
		});
	}

	private fetch() {
		this.service.getSchemes()
			.subscribe(d => {
				this.items = d;
			});
	}
}
