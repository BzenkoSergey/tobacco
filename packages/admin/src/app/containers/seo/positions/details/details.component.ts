import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { ResourcesItemsRestService } from '@rest/resources-items';
import { PipeRestService } from '@rest/pipes';

@Component({
	templateUrl: './details.html',
	styleUrls: ['./details.scss'],
	providers: [
		ResourcesItemsRestService,
		PipeRestService
	]
})

export class SeoPositionsDetailsComponent implements OnDestroy {
	private sub: Subscription;
	query: string;
	items: any[] = [];
	search = '';
	loading = false;
	openKeys = new Map();
	openMeta = new Map();

	constructor(
		private service: ResourcesItemsRestService,
		private pipesService: PipeRestService,
		route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.query = params.query;
			this.search = params.query.replace(/\+/g, ' ');
			this.fetch();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	getMeta(session: any) {
		const f = [];
		session.pages.forEach(p => {
			p.items.forEach(i => {
				f.push({
					text: i.description,
					keys: i.keys.join(' ')
				});
			});
		});
		return f;
	}

	getKeys(session: any) {
		const map = new Map<string, any>();

		session.pages.forEach(p => {
			p.items.forEach(i => {
				const pos = ((i.page - 1) * 10) + i.position;
				i.keys.forEach(k => {
					const g = map.get(k) || {
						key: k,
						poss: [],
						count: 0
					};
					g.count = g.count + 1;
					if (!g.poss.includes(pos)) {
						g.poss.push(pos);
					}
					map.set(k, g);
				});
			});
		});
		const f = [];
		map.forEach((v, k) => {
			v.poss = v.poss.sort((a, b) => a - b);
			f.push(v);
		});
		return f.sort((a, b) => {
			return a.poss[0] - b.poss[0];
		});
	}

	runSearch() {
		this.loading = true;
		this.pipesService.runSchemeByIdOptions<any, any>(
			'5c4e3afcc65293ef1b5bfea0',
			this.search
		)
		.subscribe(
			() => {
				this.loading = false;
			},
			() => {
				this.loading = false;
			}
		);
	}

	getHoogle(session: any) {
		let re;
		session.pages.forEach(p => {
			const r = p.items.find(i => {
				return this.isHoogle(i.url);
			});
			if (r) {
				re = r;
			}
		});
		return re;
	}

	isHoogle(url: string) {
		return !!~url.indexOf('hoogle.com.ua');
	}

	sortPages(d: any[]) {
		return d.sort((a, b) => {
			return a.page - b.page;
		});
	}

	sortItems(d: any[]) {
		return d.sort((a, b) => {
			return a.position - b.position;
		});
	}

	sortSessions(d: any[]) {
		return (d || []).sort((a, b) => {
			return b.session - a.session;
		});
	}

	private fetch(query?: any) {
		this.loading = true;
		const sub = this.service.aggregate([
			{
				$match: {
					'query': this.query,
					'resource': '5c4ddc899fd908d940443494',
					'structureCode': 'ITEM'
				}
			},
			{
					$group : {
							_id: '$session',
							items: {
									$push: '$$ROOT'
							},
							pagesNumbers: { $addToSet: '$page' },
							session: { $addToSet: '$session' }
					}
			},
			{
				$project: {
					totalPages: {
						$size: '$pagesNumbers'
					},
					totalItems: {
						$size: '$items'
					},
					session: {
						$arrayElemAt: ['$session', 0]
					},
					pages: {
						$map: {
							input: '$pagesNumbers',
							as: 'page',
							in: {
								page: '$$page',
								items: {
									$filter: {
										input: '$items',
										as: 'num',
										cond: {
											$and: [
											{ $eq: [ '$$num.page', '$$page' ] }
										]
										}
									}
								}
							}
						}
					}
				}
			}
		]);
		sub.subscribe(
			d => {
				this.loading = false;
				this.items = d;
			},
			e => {
				this.loading = false;
			}
		);
	}
}
