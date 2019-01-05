import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subject, combineLatest, Observable, of } from 'rxjs';

import { PipesRestService } from '@rest/pipes';

@Component({
	templateUrl: './pipes.html',
	styleUrls: ['./pipes.scss'],
	providers: [PipesRestService],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
			state('expanded', style({height: '*'})),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	]
})

export class PipesComponent implements OnInit {
	columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
	columns = [
		'startDate',
		'endDate',
		'id',
		'uniqueId',
		'status',
		'error'
	];
	expandedElement: any;
	expandedElement2: any;

	pipes: any[] = [];
	pipesLine: any[] = [];
	pipesGroup: any[] = [];

	pipe: any;
	pipeId: string;
	groupId: string;
	group: any;
	currentPipe: any;

	process: any;
	schemes: any[] = [];
	schemeProcesses = new Map<string, any[]>();
	interval: any;

	schemeItem: any;

	map = new Map();

	constructor(
		private pipesRestService: PipesRestService
	) {
		window['a1'] = this;
	}

	ngOnInit() {
		this.fetchAll();
	}

	selectschemeItem(a) {
		this.schemeItem = a;
	}

	trackBy(index, item) {
		return item._id || item.id;
	}

	startListenPipeProcess(schemeId: string, processId: string, path: string) {
		this.pipesRestService.runProcessPaths(processId, [path])
			.subscribe(d => {
				console.log('Process Pipe Done');
			});

		this.interval = setInterval(() => {
			console.log('inter');
			this.fetchSchemeProcesses(schemeId);
		}, 500);
	}

	runScheme(schemeId: string) {
		this.pipesRestService.runScheme(schemeId)
			.subscribe(d => {
				this.fetchSchemeProcesses(schemeId);
				console.log('Scheme Started');
			});
	}

	startListenSchemeProcess(schemeId: string, processId: string) {
		this.pipesRestService.runProcess(processId)
			.subscribe(d => {
				console.log('Process Done');
			});
		this.interval = setInterval(() => {
			console.log('inter');
			this.fetchSchemeProcesses(schemeId);
		}, 500);
	}

	stopListenSchemeProcess() {
		if (this.interval) {
			console.log('clear');
			clearInterval(this.interval);
		}
	}

	fetchSchemes() {
		return this.pipesRestService.getSchemes();
	}

	fetchSchemeProcesses(schemeId: string) {
		this.pipesRestService.getSchemeProcesses(schemeId)
			.subscribe(d => {
				this.schemeProcesses.set(schemeId, d);
			});
	}

	fetchProcess(processId: string) {
		this.pipesRestService.getProcess(processId)
			.subscribe(d => {
				this.process = d;
			});
	}

	selectedGroup(e) {
		console.log(e);
	}

	restartFromPipe(pipesLineId: string, processId: string) {
		console.log(pipesLineId, processId, this.pipe.uniqueId);
		this.pipesRestService.restartPipe(pipesLineId, processId, this.pipe.uniqueId)
			.subscribe(d => {
				console.log(111);
			});
	}

	restartFromGroup(pipesLineId: string, processId: string) {
		const groupId = this.groupId;
		const groupProcessId = this.group.id;

		this.pipesRestService.restartGroup(pipesLineId, processId, groupId, groupProcessId)
			.subscribe(d => {
				console.log(222);
			});
	}

	genScheme(e: any) {
		const i = this.map.get(e._id);

		if (i) {
			return i;
		}
		const g = this.genSchemeChild(e);
		if (this.pipes.length) {
			this.map.set(e._id, g);
		}
		return g;
	}

	genSchemeChild(e: any) {
		const pipe = this.pipes.find(p => p._id === e.id) || {};

		return {
			jobName: pipe.jobName || 'NONE',
			process: {},
			data: e,
			children: this.genSchemeChilden(e.children || [])
		};
	}

	genSchemeChilden(e: any[]) {
		return e.map(d => this.genSchemeChild(d));
	}

	selectedPipe(e) {
		this.currentPipe = e;
		this.pipe = e;
		// this.pipeId = e.pipeInfo.id;
		// this.groupId = e.groupInfo.id;
		// this.group = e.group;
		console.log(e);
	}

	getPipeGroup(groupId: string) {
		return this.pipesGroup.find(p => {
			return p._id === groupId;
		});
	}

	getPipe(pipeId: string) {
		return this.pipes.find(p => {
			return p._id === pipeId;
		});
	}

	fetchAll() {
		combineLatest(
			this.fetchPipesGroup(),
			this.fetchPipesLine(),
			this.fetchPipes(),
			this.fetchSchemes()
		)
		.subscribe(d => {
			this.pipesGroup = d[0];
			this.pipesLine = d[1];
			this.pipes = d[2];
			this.schemes = d[3];
			this.schemes.forEach(i => this.fetchSchemeProcesses(i._id));
			this.schemes.forEach(i => {
				this.genScheme(i);
			});
		});
	}

	fetchPipesGroup() {
		return this.pipesRestService.getPipesGroup();
	}

	fetchPipesLine() {
		return this.pipesRestService.getPipesLine();
	}

	fetchPipes() {
		return this.pipesRestService.getPipes();
	}
}
