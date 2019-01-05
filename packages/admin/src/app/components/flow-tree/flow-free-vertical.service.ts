import { Subject } from 'rxjs';
import * as d3 from 'd3';

export class FlowTreeService {
	selected = new Subject<any>();
	selectedBranch = new Subject<any>();

	margin = {top: 20, right: 90, bottom: 30, left: 90};
	width = 2000 - this.margin.left - this.margin.right;
	height = 2000 - this.margin.top - this.margin.bottom;
	svg;
	treemap;
	root;
	duration = 0;
	i = 0;

	run2(treeData: any, viewElement: HTMLElement) {
		// Set the dimensions and margins of the diagram


		// append the svg object to the body of the page
		// appends a 'group' element to 'svg'
		// moves the 'group' element to the top left margin
		console.log('rrrrrrun');
		this.svg = d3.select(viewElement).append('svg')
		// .attr('width', '100%')
		// .attr('height', '100%')
			// .attr('viewBox', '0 0 100 100' )
			.attr('width', this.width + this.margin.right + this.margin.left)
			.attr('height', this.height + this.margin.top + this.margin.bottom)
			.append('g')
			.attr('transform', 'translate('
				+ this.margin.left + ',' + this.margin.top + ')');

		// declares a tree layout and assigns the size
		this.treemap = d3.tree().size([this.height, this.width]);

		// // Assigns parent, children, height, depth
		// this.root = d3.hierarchy(treeData, function(d) { return d.children; });
		// this.root.x0 = this.height / 2;
		// this.root.y0 = 0;

		// Collapse after the second level
		// root.children.forEach(collapse);

		this.update(treeData);

		// Collapse the node and all it's children
		function collapse(d) {
			if (d.children) {
				d._children = d.children;
				d._children.forEach(collapse);
				d.children = null;
			}
		}
	}

	update(data?: any) {
		this.root = d3.hierarchy(data, function(d) { return d.children; });
		this.root.x0 = 0;
		this.root.y0 = this.width / 2;

		// Assigns the x and y position for the nodes
		const treeData = this.treemap(this.root);

		// Compute the new tree layout.
		const nodes = treeData.descendants();
		const links = treeData.descendants().slice(1);

		// Normalize for fixed-depth.
		nodes.forEach(function(d) { d.y = d.depth * 100; });

		// ****************** Nodes section ***************************

		// Update the nodes...
		const node = this.svg.selectAll('g.node')
			.data(nodes, (d) => {
				return d.id || (d.id = ++this.i);
			});

		// Enter any new modes at the parent's previous position.
		const nodeEnter = node.enter().append('g')
			.attr('class', 'node')
			.attr('transform', (d) => {
				return 'translate(' + this.root.x0 + ',' + this.root.y0 + ')';
			})
			.on('click', click);

		// Add Circle for the nodes
		nodeEnter.append('circle')
			.attr('class', 'node')
			.attr('r', 1e-6)
			.style('fill', function(d) {
				return d._children ? 'lightsteelblue' : '#fff';
			});

		// Add labels for the nodes
		nodeEnter.append('text')
			.attr('dy', '-1.4em')
			.attr('x', function(d) {
				return d.children || d._children ? '0.2em' : '0.2em';
			})
			.attr('text-anchor', function(d) {
				return d.children || d._children ? 'middle' : 'middle';
			})
			.text(function(d) {
				// console.log(d.data);
				const value = d.data.label || '';
				return value + '\r\n(' + d.data.jobName + ')';
			});

		// UPDATE
		const nodeUpdate = nodeEnter.merge(node);

		// Transition to the proper position for the node
		nodeUpdate.transition()
			.duration(this.duration)
			.attr('transform', function(d) {
				// тут
				console.log(d.x);
				return 'translate(' + d.x + ',' + d.y + ')';
			});

		// Update the node attributes and style
		nodeUpdate.select('circle.node')
			.attr('r', 5)
			.style('fill', function(d) {
				return d._children ? 'lightsteelblue' : '#fff';
			})
			.attr('status', function(d) {
				return d.data.process.status;
			})
			.attr('cursor', 'pointer');


		// Remove any exiting nodes
		const nodeExit = node.exit().transition()
			.duration(this.duration)
			.attr('transform', (d) => {
				return 'translate(' + this.root.x + ',' + this.root.y + ')';
			})
			.remove();

		// On exit reduce the node circles size to 0
		nodeExit.select('circle')
			.attr('r', 1e-6);

		// On exit reduce the opacity of text labels
		nodeExit.select('text')
			.style('fill-opacity', 1e-6);

		// ****************** links section ***************************

		// Update the links...
		const link = this.svg.selectAll('path.link')
			.data(links, function(d) { return d.id; });

		// Enter any new links at the parent's previous position.
		const linkEnter = link.enter().insert('path', 'g')
			.attr('class', 'link')
			.attr('d', (d) => {
				const o = {x: this.root.x0, y: this.root.y0};
				return diagonal(o, o);
			});

		// UPDATE
		const linkUpdate = linkEnter.merge(link);

		// Transition back to the parent element position
		linkUpdate.transition()
			.duration(this.duration)
			.attr('d', (d) => {
				return diagonal(d, d.parent);
			});

		// Remove any exiting links
		const linkExit = link.exit().transition()
			.duration(this.duration)
			.attr('d', (d) => {
				const o = {x: this.root.x, y: this.root.y};
				return diagonal(o, o);
			})
			.remove();

		// Store the old positions for transition.
		nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});

		// Creates a curved (diagonal) path from parent to the child nodes
		function diagonal(s, d) {
			// const path = `M ${s.y} ${s.x}
			// 		C ${(s.y + d.y) / 2} ${s.x},
			// 			${(s.y + d.y) / 2} ${d.x},
			// 			${d.y} ${d.x}`;

			const path = `M ${s.x} ${s.y}
			C ${(s.x + d.x) / 2} ${s.y},
			  ${(s.x + d.x) / 2} ${d.y},
			  ${d.x} ${d.y}`;
						// console.log(path);
			return path;
		}

		const self = this;
		// Toggle children on click.
		function click(d) {
			// console.log(d);
			self.selected.next(d.data);
			self.selectedBranch.next({
				current: d.data,
				parent: d.parent ? d.parent.data : null
			});
			// if (d.children) {
			// 	d._children = d.children;
			// 	d.children = null;
			// 	} else {
			// 	d.children = d._children;
			// 	d._children = null;
			// }
			// self.update(d);
		}
	}
}
