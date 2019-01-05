import { Subject } from 'rxjs';
import * as d3 from 'd3';

export class FlowTreeService {
	runned: Subject<any>;
	runnedFn: any;
	next: Subject<any>;
	nextFn: any;

	selected = new Subject<any>();
	selectedBranch = new Subject<any>();
	private current: string;

	margin = {top: 5, right: 20, bottom: 5, left: 20};
	width = 960 - this.margin.left - this.margin.right;
	height = 960 - this.margin.top - this.margin.bottom;
	svg;
	wrapper;
	treemap;
	root;
	duration = 0;
	i = 0;
	base;

	setCurrent(path: string) {
		this.current = path;
		if (!this.svg) {
			return;
		}
		this.svg.selectAll('g.node circle')
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

	runNext() {
		if (!this.next || !this.nextFn) {
			return;
		}
		this.runned = this.next;
		this.runnedFn = this.nextFn;
		this.runnedFn();
	}

	run2(treeData: any, viewElement: HTMLElement, subj?: Subject<any>) {

		this.base = d3.select(viewElement);
		this.wrapper = this.base.append('svg');
		this.svg = this.wrapper
			.append('g')
			.attr('transform', 'translate('
				+ this.margin.left + ',' + this.margin.top + ')')

			.on('click.g.node', () => {
				this.click(d3.select(d3.event.target).datum());
			});

		// declares a tree layout and assigns the size
		this.treemap = d3.tree()
			.nodeSize([18, 18])
			.separation(() => {
				return 1;
			});

		if (!treeData) {
			return;
		}
		this.update(treeData);
	}

	click(d) {
		this.selected.next(d.data);
		this.selectedBranch.next({
			current: d.data,
			parent: d.parent ? d.parent.data : null
		});
	}

	update(data?: any) {
		const f = Date.now();
		console.log('RUNen update');
		this.root = d3.hierarchy(data, function(d) { return d.children; });

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
		const nodes = treeData.descendants();
		const links = treeData.descendants().slice(1);


		// Normalize for fixed-depth.
		nodes.forEach(function(d) {
			// const hasParent = d.parent;
			// if (hasParent) {
			// 	const index = d.parent.children.indexOf(d);
			// 	const isLast = d.parent.children.length === index + 1;
			// 	if (!index) {
			// 		d.x = d.parent.x;
			// 	} else {
			// 		d.x = d.parent.children[index - 1].x + 20;
			// 		// if (isLast) {
			// 		// 	d.x = d.x + 12;
			// 		// } else {
			// 		// }
			// 	}
			// 	// console.log(d.parent.children.indexOf(d));
			// } else {
			// 	d.x = d.children[0].x;
			// 	console.log(d.x);
			// }
			return d.y = d.depth * 45;
		});

		// ****************** Nodes section ***************************

		// Update the nodes...
		const node = this.svg.selectAll('g.node')
			.data(nodes, (d) => {
				return d.data.path + '-' + d.data.process.status + '-' + d.data.label + '-' + d.data.jobName;
			});

		// Enter any new modes at the parent's previous position.
		const nodeEnter = node.enter()
			.append('g')
			.attr('class', 'node');

		// Add Circle for the nodes
		nodeEnter.append('circle')
			.attr('status', function(d) {
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
		const link = this.svg.selectAll('path.link')
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
		nodes.forEach(function(d) {
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
}
