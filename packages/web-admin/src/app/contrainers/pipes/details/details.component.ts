import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subject, combineLatest, Observable, of } from 'rxjs';

import { PipesRestService } from '@rest/pipes';

@Component({
	templateUrl: './details.html',
	providers: [PipesRestService]
})

export class PipesDetailsComponent implements OnInit {
	item: any;
	itemId: string;
	view: any;
	pipes: any[] = [];
	pipe: any;
	branch: any;
	processes: any[];

	constructor(
		private service: PipesRestService,
		route: ActivatedRoute
	) {
		// route.params.subscribe(p => {
		// 	this.itemId = p.schemeId;
		// 	this.fetchAll();
		// 	this.fetchProcesses();
		// });
	}

	ngOnInit() {

		// this.breadcrumbsService.store([
		// 	{label: 'Home' , url: '/', params: []},
		// 	{label: 'Pipes' , url: '/pipes', params: []},
		// 	{label: 'Pipe' , url: '/' + this.itemId, params: []}
		// ]);
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
		const parent = this.branch.parent.data;
		parent.children = parent.children.filter(c => c !== item);
		this.save();
	}

	save() {
		console.log(this.itemId);
		this.service.saveScheme(this.itemId, this.item)
			.subscribe(d => {
				console.log('saved');
				this.view = this.genSchemeChild(this.item);
			});
	}

	selectBranch(branch: any) {
		this.branch = branch;
	}

	select(pipe: any) {
		console.log(pipe);
		this.pipe = pipe;
	}

	createProcess() {
		this.service.runScheme(this.itemId)
			.subscribe(d => {
				this.fetchProcesses();
			});
	}

	private fetchProcesses() {
		this.service.getSchemeProcesses(this.itemId)
			.subscribe(d => this.processes = d);
	}

	private genSchemeChild(e: any) {
		const pipe = this.pipes.find(p => p._id === e.id) || {};

		return {
			jobName: pipe.jobName || 'NONE',
			label: e.label || '',
			process: {},
			data: e,
			children: this.genSchemeChilden(e.children || [])
		};
	}

	private genSchemeChilden(e: any[]) {
		return e.map(d => this.genSchemeChild(d));
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
		});
	}

	private fetchPipes() {
		return this.service.getPipes();
	}

	private fetch() {
		return this.service.getScheme(this.itemId);
	}
}
