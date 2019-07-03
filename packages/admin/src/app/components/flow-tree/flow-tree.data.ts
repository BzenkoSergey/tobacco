import { Injectable } from '@angular/core';

import * as d3 from 'd3';

export enum PipeStatus {
	PENDING = 'PENDING',
	IN_PROCESS = 'IN_PROCESS',
	SKIPPED_JOB = 'SKIPPED_JOB',
	DONE = 'DONE',
	ERROR = 'ERROR',
	STOPPED = 'STOPPED',
	PAUSED = 'PAUSED'
}

@Injectable()
export class FlowTreeData {
	private root: any;
	private data = new Map<string, any>();
	private parents = new Map<any, any>();
	private children = new Map<any, any>();
	private boxes: any[] = [];
	private tree: any;

	private nodes = new Map<string, d3.Selection<SVGSVGElement, any, SVGGElement, {}>>();

	update(data: any[]|any) {
		if (!Array.isArray(data)) {
			this.tree = data;
			this.tree.children = data.children || [];
			return;
		}
		data.forEach(item => {
			this.data.set(item.path, item);
			if (!item.parent) {
				this.root = item;
			} else {
				const children = this.parents.get(item.parent) || [];
				children.push(item);
				this.parents.set(item.parent, children);
			}
		});

		this.tree = this.genTree(this.root);
		this.defineBoxData();
	}

	getTree() {
		return this.tree;
	}

	private defineBoxData() {
		this.boxes
			.filter(b => b.statuses)
			.forEach(b => {
				const pending = b.statuses.filter(s => s === PipeStatus.PENDING);
				const inProcess = b.statuses.filter(s => s === PipeStatus.IN_PROCESS);
				const skippedJob = b.statuses.filter(s => s === PipeStatus.SKIPPED_JOB);
				const done = b.statuses.filter(s => s === PipeStatus.DONE);
				const error = b.statuses.filter(s => s === PipeStatus.ERROR);

				const statuses = b.statuses.length / 100;

				b.percentage = {
					pending: pending.length / statuses,
					inProcess: inProcess.length / statuses,
					skippedJob: skippedJob.length / statuses,
					done: done.length / statuses,
					error: error.length / statuses
				};
			});
	}

	private genTree(root: any, boxRoot?: any) {
		const children = this.parents.get(root.id) || [];
		const boxChildren = children.length >= 6;

		if (root.box) {
			boxRoot = boxRoot || root;
			boxRoot.statuses = [];
		}
		children.forEach(c => {
			c.box = boxChildren;
			c.hide = root.box || root.hide;
			if (c.box) {
				this.boxes.push(c);
			}
			if (boxRoot) {
				boxRoot.statuses.push(c.process.status);
			}
			this.genTree(c, boxRoot);
		});
		root.children = children;
		return root;
	}
}
