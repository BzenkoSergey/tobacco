import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subject, combineLatest, Observable, of } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';

import { PipesRestService } from '@rest/pipes';

import { FlowTreeComponent } from '@components/flow-tree/flow-tree.component';

@Component({
	templateUrl: './process.html',
	styleUrls: ['./process.scss'],
	providers: [PipesRestService]
})

export class PipesDetailsProcessComponent implements AfterViewInit {
	@ViewChild(FlowTreeComponent) flowTree: FlowTreeComponent;
	schemeId: string;
	processId: string;
	item: any;
	path: string;
	pipe: any;

	input: any;
	output: any;

	constructor(
		private service: PipesRestService,
		private router: Router,
		private route: ActivatedRoute
	) {
	}

	ngAfterViewInit() {
		// this.flowTree.run(this.item);
		this.route.params.subscribe(p => {
			this.schemeId = p.schemeId;
			this.processId = p.processId;
			this.fetch()
				.subscribe(() => {});
		});

		this.route.queryParams.subscribe(p => {
			this.path = p.path;
			this.flowTree.updateCurrent(this.path);
			this.definePipe();
		});
	}

	select(pipe: any) {
		this.router.navigate([], {
			queryParams: {
				path: pipe.path
			}
		});
	}

	run() {
		this.service.runProcess(this.processId)
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
		this.service.runProcessPaths(this.processId, [this.path])
			.subscribe(() => {});
		setTimeout(() => {
			this.watch();
		}, 1500);
	}

	watch() {
		console.log('watch');
		this.fetch()
			.pipe(delay(1000))
			.subscribe(d => {
				console.log('watch done');
				if (d.process.status !== 'DONE' && d.process.status !== 'ERROR') {
					this.watch();
				}
			});
	}

	private getProcessData(dataId: string) {
		if (!dataId) {
			return of(' ');
		}
		return this.service
			.runSchemeOptions('5c073ef5d6ebe9dc83814ac3', {
				collection: 'scheme-processes-data',
				id: dataId
			})
			.pipe(
				map(d => JSON.stringify(d.content))
			);
	}

	d() {
		this.service
			.runSchemeOptions('5c073ef5d6ebe9dc83814ac3', {
				collection: 'scheme-processes',
				id: this.processId
			})
			.pipe(
				tap(d => {
					this.item = d;
					this.flowTree.updateData(this.item);
				})
			).subscribe();
	}

	private fetch() {
		return this.service
			.runSchemeOptions('5c073ef5d6ebe9dc83814ac3', {
				collection: 'scheme-processes',
				id: this.processId
			})
			.pipe(
				tap(d => {
					this.item = d;
					this.definePipe();
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
		let obj = this.item;
		this.path
			.split('.')
			.forEach(s => {
				obj = obj[s];
			});
		this.pipe = obj;
		this.defineProcessData();
	}
}
