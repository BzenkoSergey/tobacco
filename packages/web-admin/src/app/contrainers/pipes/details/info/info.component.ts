import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subject, combineLatest, Observable, of } from 'rxjs';

import { PipesRestService } from '@rest/pipes';

@Component({
	templateUrl: './info.html',
	providers: [PipesRestService]
})

export class PipesDetailsInfoComponent implements OnInit {
	private parents = new Map<any, any>();
	private pipesIds = new Map<string, any>();
	private paths = new Map<string, any>();
	private pathsPipe = new Map<any, string>();
	item: any;
	itemId: string;
	view: any;
	pipes: any[] = [];
	pipe: any;
	path: string;
	processes: any[];

	constructor(
		private service: PipesRestService,
		private router: Router,
		route: ActivatedRoute
	) {
		route.params.subscribe(p => {
			this.itemId = p.schemeId;
			this.fetchAll();
			this.fetchProcesses();
		});

		route.queryParams.subscribe(p => {
			this.path = p.path;
			this.pipe = this.definePipe();
		});
	}

	ngOnInit() {

	}

	addChild(parent: any) {
		parent.children.push({
			id: null,
			type: '',
			label: '',
			children: []
		});
		this.save();
	}

	remove(item: any) {
		const parent = this.parents.get(item);
		parent.children = parent.children.filter(c => c !== item);
		this.save();
	}

	save() {
		console.log(this.itemId);
		this.service.saveScheme(this.itemId, this.item)
			.subscribe(d => {
				console.log('saved');
				this.view = this.genSchemeChild(this.item);
				this.defineParents(this.item);
				this.pipe = this.definePipe();
			});
	}

	select(pipe: any) {
		this.router.navigate([], {
			queryParams: {
				path: pipe.path
			}
		});
	}

	createProcess() {
		this.service.runScheme(this.itemId)
			.subscribe(d => {
				console.log('DONE');
			});

		setTimeout(() => {
			this.fetchProcesses();
		}, 2000);
	}

	hasParent(pipe: any) {
		return this.parents.get(pipe);
	}

	private fetchProcesses() {
		// return this.service
			// .runSchemeOptions('5c07460ef1c629de3781cc21', {
			// 	collection: 'pipes',
			// 	query: {
			// 		id: this.itemId
			// 	}
			// })
		this.service.getSchemeProcesses(this.itemId)
			.subscribe(d => this.processes = d);
	}

	private genSchemeChild(e: any, path = '0') {
		const pipe = this.pipes.find(p => p._id === e.id) || {};

		this.paths.set(path, e);
		this.pathsPipe.set(e, path);
		return {
			jobName: pipe.jobName || 'NONE',
			label: e.label || '',
			path: path,
			process: {},
			data: e,
			children: this.genSchemeChilden(e.children || [], path + 1)
		};
	}

	private genSchemeChilden(e: any[], path: string) {
		return e.map((d, i) => this.genSchemeChild(d, path + i));
	}

	private fetchAll() {
		combineLatest(
			this.fetchPipes(),
			this.fetch()
		)
		.subscribe(d => {
			this.pipes = d[0];
			this.item = d[1];
			this.view = this.genSchemeChild(d[1]);
			this.defineParents(this.item);
			this.pipe = this.definePipe();
		});
	}

	private defineParents(pipe: any) {
		this.pipesIds.set(pipe.id, pipe);
		pipe.children.forEach(c => {
			this.pipesIds.set(c.id, c);
			this.parents.set(c, pipe);
			this.defineParents(c);
		});
	}

	private fetchPipes() {
		return this.service
			.runSchemeOptions('5c07460ef1c629de3781cc21', {
				collection: 'pipes',
				query: {}
			});
	}

	private fetch() {
		return this.service
			.runSchemeOptions('5c073ef5d6ebe9dc83814ac3', {
				collection: 'scheme',
				id: this.itemId
			});
	}

	private definePipe() {
		return this.paths.get(this.path);
	}
}
