import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of, combineLatest } from 'rxjs';
import { tap, mergeMap, filter, map } from 'rxjs/operators';

import { ResourcesRestService, ResourceDto, ResourceStructureDto } from '@rest/resources';
import { SchemesRestService } from '@rest/schemes';
import { SchemeGroupsRestService, SchemeGroupDto } from '@rest/scheme-groups';
import { PipeRestService, PipeDto } from '@rest/pipes';

import { ConfirmComponent } from '@components/confirm/confirm.component';
import { UpsertComponent } from './upsert/upsert.component';

import itemScheme from './item-scheme.json';
import linksScheme from './links-scheme.json';
import fetchScheme from './fetch-scheme.json';
import intervalScheme from './interval-scheme.json';

@Component({
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [
		PipeRestService,
		ResourcesRestService,
		SchemeGroupsRestService,
		SchemesRestService
	]
})

export class OverviewComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	private map = new Map();
	private parents = new Map<any, any>();
	private pipesIds = new Map<string, any>();
	private paths = new Map<string, any>();
	private pathsPipe = new Map<any, string>();

	saving = false;
	item = new ResourceDto();
	schemes: any[] = [];

	pipes: PipeDto[] = [];
	pipe: PipeDto;
	path: string;

	openned = '';

	constructor(
		private modalService: NgbModal,
		private service: ResourcesRestService,
		private pipeRestService: PipeRestService,
		private schemeGroupsService: SchemeGroupsRestService,
		private schemesRestService: SchemesRestService,
		private router: Router,
		route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.resourceId;
			this.fetch();
		});
		this.sub = route.queryParams.subscribe(p => {
			this.openned = p.openned;
			this.path = p.path;
			this.pipe = this.definePipe();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	select(pipe: any) {
		this.router.navigate([], {
			queryParams: {
				path: pipe.path
			},
			queryParamsHandling: 'merge'
		});
	}

	genLinks() {
		const fetchSchemeClone = JSON.parse(JSON.stringify(fetchScheme));
		const linksSchemeClone = JSON.parse(JSON.stringify(linksScheme));
		const fetchDom = this.getByCode(fetchSchemeClone, 'DOM');
		fetchDom.children.push(linksSchemeClone);
		fetchSchemeClone.label = this.item.name + ' Links';
		fetchSchemeClone.code = 'LINKS';
		fetchSchemeClone.input = this.item.path;
		return fetchSchemeClone;
	}

	genComplex() {
		const links = this.genLinks();
		const dom = this.getByCode(links, 'DOM');
		this.genProducts()
			.forEach(s => dom.children.push(s));

		const ignoreLinks = this.getByCode(links, 'IGNORE_LINKS');
		ignoreLinks.options = JSON.stringify(this.item.ignoreLinks);
		links.input = this.item.path;
		links.label = this.item.name + ' Complex';
		links.code = 'COMPLEX';
		return links;
	}

	genProducts() {
		return this.item.structures.map(s => {
			const st = JSON.parse(JSON.stringify(itemScheme));
			st.services = ['EXT'];
			st.options = s.structure;
			st.label = this.item.name + ' ' + s.name;
			st.code = s.code;
			return st;
		});
	}

	genProductsFetch() {
		return this.genProducts()
			.map(s => {
				const fetchSchemeClone = JSON.parse(JSON.stringify(fetchScheme));
				const fetchDom = this.getByCode(fetchSchemeClone, 'DOM');
				fetchDom.children.push(s);
				fetchSchemeClone.label = s.label + ' Fetch';
				fetchSchemeClone.code = s.code + '_FETCH';
				return fetchSchemeClone;
			});
	}

	genInterval() {
		const intervalSchemeClone = JSON.parse(JSON.stringify(intervalScheme));
		const productsFetch = this.genProductsFetch();
		const delayItem = this.getByCode(intervalSchemeClone, 'DELAY_ITEM');
		productsFetch
			.forEach(s => delayItem.children.push(s));
		const interval = this.getByCode(intervalSchemeClone, 'INTERVAL');
		const intervalOptions = JSON.parse(interval.options);
		intervalOptions.delay = this.item.settings.itemsSync;
		interval.options = JSON.stringify(intervalOptions);
		intervalSchemeClone.input = this.item._id;
		intervalSchemeClone.label = this.item.name + ' Interval';
		intervalSchemeClone.code = 'INTERVAL';
		return intervalSchemeClone;
	}

	generate() {
		let schemes: any[] = this.genProducts();
		schemes = schemes.concat(this.genProductsFetch());
		const links = this.genLinks();
		const complex = this.genComplex();
		const interval = this.genInterval();
		schemes.unshift(links);
		schemes.unshift(complex);
		schemes.unshift(interval);

		this.applySchemes(schemes);
	}

	applySchemes(schemes: any[]) {
		if (!this.schemes.length) {
			this.schemes = schemes;
			this.saveSchemes();
			return;
		}
		this.schemes = schemes.map(s => {
			const generated = this.schemes.find(sc => sc.code === s.code);
			if (generated) {
				s._id = generated._id;
				return s;
			}
			return s;
		});
		this.saveSchemes();
	}

	saveSchemes() {
		const subjs = this.schemes.map(s => {
			if (s._id) {
				return this.schemesRestService.update(s._id, s)
					.pipe(
						map(() => s._id)
					);
			}
			return this.schemesRestService.create(s);
		});

		combineLatest(...subjs)
			.subscribe(
				(d: number|any) => {
					const created: string[] = [];
					const ids = d.map(i => {
						if (typeof i === 'string') {
							created.push(i);
							return i;
						}
						return i.id;
					});
					this.item.schemes = ids;
					this.save()
						.subscribe();

					if (created.length) {
						this.updateGroup(created);
					}
				}
			);
	}

	updateGroup(schemes: string[]) {
		this.schemeGroupsService.get('5c1bb561740e4244434b5c90')
			.subscribe(d => {
				d.schemes = d.schemes.concat(schemes);
				this.schemeGroupsService.update(d._id, d)
					.subscribe();
			});
	}

	getByCode(scheme: any, code: string) {
		if (scheme.code === code) {
			return scheme;
		}
		if (!scheme.children.length) {
			return null;
		}
		const items = scheme.children
			.map(c => this.getByCode(c, code))
			.filter(c => !!c);

		return items[0];
	}

	addChild(parent: PipeDto, scheme: any) {
		parent.children.push({
			_id: null,
			id: null,
			type: '',
			label: '',
			children: [],
			services: [],
			options: '',
			jobName: '',
			code: ''
		});
		this.saveScheme(scheme);
	}

	remove(item: PipeDto, scheme: any) {
		const parent = this.parents.get(item);
		parent.children = parent.children.filter(c => c !== item);
		this.saveScheme(scheme);
	}

	saveScheme(scheme: any) {
		this.schemesRestService.update(scheme._id, scheme)
			.subscribe();
	}

	private save() {
		this.saving = true;
		return this.service.update(this.itemId, this.item)
			.pipe(
				tap(() => {
					this.saving = false;
				})
			);
	}

	private fetchSchemes(ids: string[]) {
		return this.schemesRestService.list({
			_id: {
				$in: ids.map(i => '$' + i)
			}
		});
	}

	private fetch() {
		this.service.get(this.itemId)
			.pipe(
				tap(d => {
					this.item = d;
				}),
				mergeMap(d => {
					if (!d.schemes.length) {
						return of([[], []]);
					}
					return combineLatest(
						this.fetchSchemes(d.schemes.filter(u => !!u)),
						this.fetchPipes()
					);
				})
			)
			.subscribe(
				d => {
					this.pipes = d[1];
					this.schemes = d[0];
					this.schemes.forEach(s => {
						this.map.set(s._id, this.genSchemeChild(s, s._id));
						this.defineParents(s);
					});
					this.pipe = this.definePipe();
				}
			);
	}

	hasParent(pipe: PipeDto) {
		return this.parents.get(pipe);
	}

	private defineParents(pipe: PipeDto) {
		this.pipesIds.set(pipe.id, pipe);
		pipe.children.forEach(c => {
			this.pipesIds.set(c.id, c);
			this.parents.set(c, pipe);
			this.defineParents(c);
		});
	}

	private genSchemeChild(e: any, id: string, path = '0') {
		const pipe = this.pipes.find(p => p._id === e.id) || {
			jobName: ''
		};

		this.paths.set(id + '-' + path, e);
		this.pathsPipe.set(e, path);
		return {
			jobName: pipe.jobName || 'NONE',
			label: e.label || '',
			path: path,
			process: {},
			data: e,
			children: this.genSchemeChilden(e.children || [], id, path + 1)
		};
	}

	private genSchemeChilden(e: any[], id: string, path: string) {
		return e.map((d, i) => this.genSchemeChild(d, id, path + i));
	}

	private fetchPipes() {
		return this.pipeRestService.list();
	}

	private definePipe() {
		console.log(this.paths);
		return this.paths.get(this.openned + '-' + this.path);
	}
}
