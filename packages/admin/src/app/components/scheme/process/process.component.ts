import { Component, ViewChild, Input, Output, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, of, combineLatest } from 'rxjs';
import { tap, mergeMap, delay, filter, map } from 'rxjs/operators';

import { SchemeProcessesRestService } from '@rest/scheme-processes';
import { SchemeProcessesDataRestService } from '@rest/scheme-processes-data';
import { SchemeProcessesOptionsRestService } from '@rest/scheme-processes-options';
import { SchemesRestService } from '@rest/schemes';
import { PipeRestService, PipeDto } from '@rest/pipes';

import { FlowTreeData } from './../../flow-tree/flow-tree.data';
import { FlowTreeComponent } from '@components/flow-tree/flow-tree.component';

@Component({
	selector: 'scheme-process',
	templateUrl: './process.html',
	providers: [
		PipeRestService,
		SchemesRestService,
		SchemeProcessesRestService,
		SchemeProcessesDataRestService,
		SchemeProcessesOptionsRestService
	]
})

export class SchemeProcessComponent implements OnChanges, OnDestroy, AfterViewInit {
	@ViewChild(FlowTreeComponent) flowTree: FlowTreeComponent;
	@Input() processId: string;
	@Input() schemeId: string;

	private sub: Subscription;

	saving = false;
	item: any;
	path: string;
	pipe: any;

	input: any;
	output: any;
	options: any;

	full = false;

	constructor(
		private router: Router,
		private pipeRestService: PipeRestService,
		private schemeProcessesRestService: SchemeProcessesRestService,
		private schemeProcessesDataRestService: SchemeProcessesDataRestService,
		private schemesRestService: SchemesRestService,
		private route: ActivatedRoute,
		private flowTreeData: FlowTreeData
	) {
		this.sub = route.queryParams.subscribe(p => {
			this.path = p.path || '0';
			this.pipe = this.definePipe();
		});
	}

	ngOnChanges() {
		if (!this.processId) {
			return;
		}

		this.fetch()
			.subscribe(() => {});
	}

	ngAfterViewInit() {
		this.route.queryParams.subscribe(p => {
			this.path = p.path;
			this.flowTree.updateCurrent(this.path);
			this.definePipe();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	toJSONString(d: any) {
		if (typeof d !== 'string') {
			return JSON.stringify(d);
		}
		return d;
	}

	select(pipe: any) {
		this.router.navigate([], {
			queryParams: {
				path: pipe.path
			}
		});
	}

	run() {
		this.schemeProcessesRestService.run(this.processId)
			.subscribe(() => {
				// this.run();
			});

		// setInterval(() => {
		// 	this.fetch().subscribe(() => {})
		// }, 500);
		setTimeout(() => {
			this.watch();
		}, 1500);
	}

	runPipe() {
		this.schemeProcessesRestService.runPaths(this.processId, [this.path])
			.subscribe(() => {});
		setTimeout(() => {
			this.watch();
		}, 1500);
	}

	watch() {
		console.log('watch');
		this.fetch()
			.pipe(delay(3500))
			.subscribe(d => {
				console.log('watch done');

				// @ts-ignore
				if (d.process.status !== 'DONE' && d.process.status !== 'ERROR') {
					this.watch();
				}
			});
	}

	private getProcessData(dataId: string) {
		if (!dataId) {
			return of(' ');
		}
		return this.schemeProcessesDataRestService.get(dataId)
			.pipe(
				map(d => JSON.stringify(d.content))
			);
	}

	private fetch() {
		return this.schemeProcessesRestService.get(this.processId, this.schemeId)
			.pipe(
				tap(d => {
					this.flowTreeData.update(d);
					this.item = this.flowTreeData.getTree();
					this.definePipe();
					console.error('FETCHED AND RUN UPDATE');
					this.flowTree.updateData(this.item);
				})
			);
	}

	private defineProcessData() {
		if (!this.pipe) {
			return;
		}
		combineLatest(
			this.getProcessData(this.pipe.process.input),
			this.getProcessData(this.pipe.process.output)
		)
		.subscribe(d => {
			this.input = d[0];
			this.output = d[1];
		});
	}

	private definePipe() {
		if (!this.item) {
			this.defineProcessData();
			return;
		}
		if (!this.path) {
			this.pipe = this.item;
			this.defineProcessData();
			return;
		}

		// let obj = this.item;
		// this.path
		// 	.split('.')
		// 	.forEach(s => {
		// 		if (!obj[s]) {
		// 			debugger;
		// 			console.log(this.item);
		// 		}
		// 		obj = obj[s];
		// 	});
		// 	this.pipe = obj;
		this.pipe = this.lookup(this.item, this.path);
		console.log(this.pipe.jobName, this.pipe.path === this.path);
		this.defineProcessData();
	}

	private lookup(item: any, path: string) {
		if (item.path === path) {
			return item;
		}
		const r = path.startsWith(item.path);
		if (r) {
			const children = item.children || [];
			if (children.length) {
				return children.map(c => this.lookup(c, path))
					.find(i => !!i);
			}
			return null;
		}
		return null;
	}
}

// children.0.
// children.0.
// children.0.
// children.0.
// children.0.
// children.0.
// children.0.
// children.1.children.0.children.0
