import { Component, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from '@angular/router';

@Component({
	selector: 'pagination',
	templateUrl: './pagination.html',
	styleUrls: ['./pagination.scss']
})

export class PaginationComponent implements OnChanges {
	@Input() page = 0;
	@Input() total = 0;
	@Input() itemsPerPage = 50;
	@Input() distance = 5;

	pages: number[] = [];

	ngOnChanges(changes: SimpleChanges) {
		this.setPages();
	}

	private setPages() {
		const totalPages = Math.floor(this.total / this.itemsPerPage);
		this.pages = [];
		if (this.total < this.itemsPerPage) {
			return;
		}

		let max = (this.page + this.distance >= totalPages) ? totalPages - 1 : this.page + this.distance;

		let min = this.page - this.distance;
		if (min - 1 < 1) {
			max = (max + 1) - min;
			min = 1;
		}
		max = (max >= totalPages) ? totalPages - 1 : max;

		this.pages.push(0);
		for (let i = min; i <= max; i++) {
			this.pages.push(i);
		}
		this.pages.push(totalPages);
	}
}
