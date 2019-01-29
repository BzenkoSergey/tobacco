import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { WikiRestService, WikiDto, WikiFieldDto, WikiFieldAttrDto } from '@rest/wiki';

@Component({
	templateUrl: './fields.html',
	styleUrls: ['./fields.scss'],
	providers: [
		WikiRestService
	]
})

export class WikiDetailsFieldsComponent implements OnDestroy {
	private sub: Subscription;

	itemId: string;
	item = new WikiDto();
	selected: string;
	loading = false;

	constructor(
		private service: WikiRestService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.id;
			if (this.itemId !== 'new') {
				this.fetch();
			} else {
				this.item = new WikiDto();
			}
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	addField() {
		this.item.fields.push(new WikiFieldDto());
	}

	removeField(f: WikiFieldDto) {
		this.item.fields = this.item.fields.filter(d => d !== f);
	}

	addAdds(f: WikiFieldDto) {
		f.adds.push(new WikiFieldAttrDto());
	}

	removeAdds(f: WikiFieldDto, a: WikiFieldAttrDto) {
		f.adds = f.adds.filter(i => i !== a);
	}

	remove() {
		this.service.remove(this.itemId)
			.subscribe(() => {
				this.router.navigate(['../../../../'], {
					relativeTo: this.route,
					queryParamsHandling: 'merge'
				});
			});
	}

	save(invalid: boolean) {
		if (invalid) {
			return;
		}
		this.loading = true;
		this.service.update(this.itemId, this.item)
			.subscribe(
				() => this.loading = false,
				() => this.loading = false
			);
	}

	getFields() {
		return this.item.fields
			.filter(f => f.visible)
			.sort((a, b) => {
				return a.order - b.order;
			});
	}

	genFieldTemplate(f: WikiFieldDto): string {
		if (f.tag) {
			let attrs = '';
			f.adds.forEach(a => {
				attrs += ` ${a.name}="${a.value}"`;
			});
			if (f.tag === 'img') {
				return `<${f.tag}${attrs}>`;
			}
			if (!f.value) {
				return '';
			}
			return `<${f.tag}${attrs}>${f.value}</${f.tag}>`;
		}
		if (!f.value) {
			return '';
		}
		return `${f.value}`;
	}

	private fetch() {
		this.loading = true;
		this.service.get(this.itemId)
			.subscribe(
				d => {
					this.item = d;
					this.loading = false;
				},
				() => this.loading = false
			);
	}
}
