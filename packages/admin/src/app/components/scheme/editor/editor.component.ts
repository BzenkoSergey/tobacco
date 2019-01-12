import { Component, ViewChild, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of, combineLatest } from 'rxjs';
import { tap, mergeMap, filter, map } from 'rxjs/operators';

import { SchemeProcessesRestService } from '@rest/scheme-processes';
import { SchemesRestService } from '@rest/schemes';
import { PipeRestService, PipeDto } from '@rest/pipes';

import { RunInputComponent } from './../run-input/run-input.component';

@Component({
	selector: 'scheme-editor',
	templateUrl: './editor.html',
	providers: [
		PipeRestService,
		SchemesRestService,
		SchemeProcessesRestService
	]
})

export class SchemeEditorComponent implements OnChanges, OnDestroy {
	@Input() item: any;
	@Input() processPath = '../../../../';

	private sub: Subscription;
	private parents = new Map<any, any>();
	private paths = new Map<string, any>();
	private pathsPipe = new Map<any, string>();

	processes: any[] = [];
	saving = false;
	view: any;
	pipes: PipeDto[] = [];
	pipe: PipeDto;
	path: string;

	constructor(
		private modalService: NgbModal,
		private router: Router,
		private pipeRestService: PipeRestService,
		private schemeProcessesRestService: SchemeProcessesRestService,
		private schemesRestService: SchemesRestService,
		route: ActivatedRoute
	) {
		this.sub = route.queryParams.subscribe(p => {
			this.path = p.path || '0';
			this.pipe = this.definePipe();
		});
	}

	ngOnChanges() {
		if (!this.item) {
			return;
		}
		this.fetchProcesses();
		this.fetchPipes()
			.subscribe(() => {
				this.view = this.genSchemeChild(this.item);
				this.defineParents(this.item);
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

	hasParent(pipe: PipeDto) {
		return this.parents.get(pipe);
	}

	addBefore(pipe: PipeDto) {
		const item = {
			_id: null,
			id: null,
			type: '',
			label: '2222',
			children: [pipe],
			services: [],
			options: '',
			jobName: '',
			code: ''
		};
		const parent = this.parents.get(pipe);
		parent.children = parent.children.map(c => {
			if (c === pipe) {
				return item;
			}
			return c;
		});
		this.saveScheme();
	}

	addChild(parent: PipeDto) {
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
		this.saveScheme();
	}

	remove(item: PipeDto) {
		const parent = this.parents.get(item);
		parent.children = parent.children.filter(c => c !== item);
		this.saveScheme();
	}

	saveScheme() {
		this.view = this.genSchemeChild(this.item);
		this.defineParents(this.item);
		this.schemesRestService.update(this.item._id, this.item)
			.subscribe();
	}

	runProcess() {
		this.schemeProcessesRestService.create(this.item._id)
			.subscribe();

		setTimeout(() => {
			this.fetchProcesses();
		}, 1000);
	}

	runProcessWithInput() {
		const modalRef = this.modalService.open(RunInputComponent);
		modalRef.componentInstance.submitted.subscribe(l => {
			this.schemeProcessesRestService.createWithData(this.item._id, l)
				.subscribe();

			setTimeout(() => {
				this.fetchProcesses();
			}, 1000);
		});
	}

	private defineParents(pipe: PipeDto) {
		pipe.children.forEach(c => {
			this.parents.set(c, pipe);
			this.defineParents(c);
		});
	}

	private genSchemeChild(e: any, path = '0') {
		const pipe = this.pipes.find(p => p._id === e.id) || {
			jobName: ''
		};

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

	private definePipe() {
		return this.paths.get(this.path);
	}

	private fetchPipes() {
		return this.pipeRestService.list()
			.pipe(
				tap(d => this.pipes = d)
			);
	}

	private fetchProcesses() {
		this.schemeProcessesRestService
			.list({
				schemeId: this.item._id,
				parent: null
			})
			.subscribe(d => {
				this.processes = d.reverse();
			});
	}
}
