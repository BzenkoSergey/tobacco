import { Subject } from 'rxjs';

import * as d3 from 'd3';
import { Selection, HierarchyNode, TreeLayout, HierarchyPointNode } from 'd3';

export type FlowTreeHierarchyNode = {
	x0: number;
	y0: number;
};

export type FlowTreeUnit = {
	process: {
		status: string;
	};
	path: string;
	label: string;
	jobName: string;
};

type FlowTreeStore = {
	x0?: number;
	y0?: number;
};

export type FlowTreeNode = HierarchyPointNode<FlowTreeUnit> & FlowTreeStore;

type HierarchyDatum = {
	name: string;
	value: number;
	children?: Array<HierarchyDatum>;
};

export class FlowTreeService {
	private runned: Subject<any>;
	private runnedFn: any;
	private next: Subject<any>;
	private nextFn: any;
	private current: string;
	private margin = {
		top: 5,
		right: 20,
		bottom: 5,
		left: 20
	};
	private svg: Selection<SVGGElement, {}, null, undefined>;
	private wrapper: Selection<SVGSVGElement, {}, null, undefined>;
	private treemap: TreeLayout<{}>;
	private root: HierarchyNode<HierarchyDatum> & FlowTreeStore;
	private base: Selection<HTMLElement, {}, null, undefined>;

	selected = new Subject<any>();
	selectedBranch = new Subject<any>();

	setCurrent(path: string) {
		this.current = path;
		if (!this.svg) {
			return;
		}
		this.svg
			.selectAll<HTMLElement, HierarchyPointNode<FlowTreeUnit>>('g.node circle')
			.attr('state', (d) => {
				if (this.current && this.current === d.data.path) {
					return 'selected';
				}
				return '';
			});
	}

	runUpdate(data: any, subj?: Subject<any>) {
		subj = subj || new Subject();
		if (this.runned) {
			this.next = subj;
			this.nextFn = () => {
				console.log('RUN UDATE');
				this.update(data);
			};
		} else {
			this.runned = subj;
			this.runnedFn = () => {
				console.log('RUN UDATE');
				this.update(data);
			};
			this.runnedFn();
		}
	}

	run(treeData: any, viewElement: HTMLElement) {
		this.base = d3.select(viewElement);
		this.wrapper = this.base.append('svg');
		this.svg = this.wrapper
			.append('g')
			.attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
			.on('click.g.node', () => {
				this.click(d3.select(d3.event.target).datum());
			});

		// declares a tree layout and assigns the size
		this.treemap = d3.tree<FlowTreeNode>()
			.nodeSize([18, 18])
			.separation(() => 1);

		if (!treeData) {
			return;
		}
		this.update(treeData);
	}

	private click(d) {
		this.selected.next(d.data);
		this.selectedBranch.next({
			current: d.data,
			parent: d.parent ? d.parent.data : null
		});
	}

	private update(data?: any) {
		const f = Date.now();
		console.log('RUNen update');
		this.root = d3.hierarchy<HierarchyDatum>(data, (d) => d.children);

		this.base.transition().on('end', () => {
			console.log(Date.now() - f);
			setTimeout(() => {
				console.log('DONE');
				const n = this.svg.node();
				const box = n.getBBox();
				this.svg.attr('transform', 'translate('
					+ this.margin.left + ',' + ((- box.y) + this.margin.top) + ')');

				this.wrapper
					.attr('width', box.width + this.margin.right + this.margin.left)
					.attr('height', box.height + this.margin.top + this.margin.bottom);

				console.log('RUN updated');
				this.runned = null;
				this.runnedFn = null;
				this.runNext();
			}, 100);
		});

		// Assigns the x and y position for the nodes
		const treeData = this.treemap(this.root);
		this.root.x0 = 0;
		this.root.y0 = 0;

		// Compute the new tree layout.
		const nodes = treeData.descendants() as FlowTreeNode[];
		const links = treeData.descendants().slice(1) as FlowTreeNode[];


		// Normalize for fixed-depth.
		nodes.forEach(function(d) {
			return d.y = d.depth * 45;
		});

		// ****************** Nodes section ***************************

		// Update the nodes...
		const node = this.svg.selectAll<SVGSVGElement, FlowTreeNode>('g.node')
			.data(nodes, (d) => {
				if (!d.data.process) {
					return '';
				}
				return d.data.path + '-' + d.data.process.status + '-' + d.data.label + '-' + d.data.jobName;
			});

		// Enter any new modes at the parent's previous position.
		const nodeEnter = node.enter()
			.append('g')
			.attr('class', 'node');

		// Add Circle for the nodes
		nodeEnter.append('circle')
			.attr('status', function(d) {
				if (!d.data.process) {
					return '';
				}
				return d.data.process.status;
			})
			.attr('state', (d) => {
				if (this.current && this.current === d.data.path) {
					return 'selected';
				}
				return '';
			});

		// Add labels for the nodes
		nodeEnter.append('text')
			.attr('dy', '-1.1em')
			.text((d) => {
				const value = d.data.label || '';
				return value + '\r\n(' + d.data.jobName + ')';
			});

		// UPDATE
		const nodeUpdate = nodeEnter.merge(node);

		console.log('CODE EX Middle 0', Date.now() - f);
		// Transition to the proper position for the node
		nodeUpdate
			.attr('transform', function(d) {
				return 'translate(' + d.y + ',' + d.x + ')';
			});

		// Remove any exiting nodes
		node.exit().remove();

		// ****************** links section ***************************

		// Update the links...
		const link = this.svg.selectAll<SVGPathElement, FlowTreeNode>('path.link')
			.data(links, (d) => {
				return d.data.path;
			});

		// Enter any new links at the parent's previous position.
		const linkEnter = link.enter()
			.insert('path', 'g')
			.attr('class', 'link')
			.attr('d', (d) => {
				return diagonal(d, d.parent);
				// const o = {x: this.root.x0, y: this.root.y0};
				// return diagonal(o, o);
			});

		// UPDATE
		const linkUpdate = linkEnter.merge(link);

		// Transition back to the parent element position
		linkUpdate.attr('d', (d) => {
			return diagonal(d, d.parent);
		});

		// Remove any exiting links
		link.exit().remove();

		// Store the old positions for transition.
		nodes.forEach(d => {
			d.x0 = d.x;
			d.y0 = d.y;
		});

		console.log('CODE EX ', Date.now() - f);

		// Creates a curved (diagonal) path from parent to the child nodes
		function diagonal(s, d) {
			const path = `M ${s.y} ${s.x}
					C ${(s.y + d.y) / 2} ${s.x},
						${(s.y + d.y) / 2} ${d.x},
						${d.y} ${d.x}`;

			return path;
		}
	}

	private runNext() {
		if (!this.next || !this.nextFn) {
			return;
		}
		this.runned = this.next;
		this.runnedFn = this.nextFn;
		this.runnedFn();
	}
}
