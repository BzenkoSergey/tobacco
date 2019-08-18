import { Component, Input, Inject, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

import { LinkService } from '@common/link.service';

@Component({
	selector: 'pagination',
	templateUrl: './pagination.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class PaginationComponent implements OnChanges, OnDestroy {
	@Input() page = 0;
	@Input() total = 0;
	@Input() itemsPerPage = 50;
	@Input() distance = 2;

	pages: number[] = [];

	constructor(
		private linkService: LinkService,
		private router: Router,
		private route: ActivatedRoute,
		@Inject(DOCUMENT) private document: Document
	) {}

	ngOnChanges() {
		this.setPages();
		this.defineRelLinks();
	}

	ngOnDestroy() {
		this.removeRels('all');
	}

	private setPages() {
		const totalPages = Math.ceil(this.total / this.itemsPerPage);
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
	}

	private defineRelLinks() {
		const i = this.pages.indexOf(this.page);
		if (!~i) {
			this.removeRels('all');
		}
		const prev = this.pages[i - 1];
		const next = this.pages[i + 1];
		if (prev !== undefined) {
			this.linkService.updateTag({
				rel: 'prev',
				href: this.genUrl(prev)
			});
		} else {
			this.removeRels('prev');
		}
		if (next !== undefined) {
			this.linkService.updateTag({
				rel: 'next',
				href: this.genUrl(next)
			});
		} else {
			this.removeRels('next');
		}
	}

	private removeRels(type: 'next'|'prev'|'all') {
		if (type === 'all') {
			this.linkService.removeTag({
				rel: 'next'
			});
			this.linkService.removeTag({
				rel: 'prev'
			});
		}
		this.linkService.removeTag({
			rel: type
		});
	}

	private genUrl(page: number) {
		const a = this.router.createUrlTree(['./'], {
			relativeTo: this.route,
			queryParams: {
				page: page
			}
		});
		return this.document.location.origin + this.router.serializeUrl(a);
	}
}
