import { Subject } from 'rxjs';
import * as d3 from 'd3';
import * as d3pie from './d.js';

export class PieService {
	render(data: any) {
		console.log(data);
		document.querySelectorAll('#pie')[0].remove();
		const d = document.createElement('div');
		d.setAttribute('id', 'pie');
		document.querySelectorAll('#pie-w')[0].appendChild(d);

		const pie = new d3pie('pie', {
			size: {
				canvasWidth: 800,
				pieInnerRadius: '70%',
				pieOuterRadius: '65%'
			},
			labels: {
				outer: {
					pieDistance: 100,
					format: 'label-percentage2'
				},
				inner: {
					format: 'none'
				},
				mainLabel: {
					fontSize: 25,
					color: '#ffffff',
					font: 'roboto, sans-serif',
				},
				percentage: {
					color: '#ffffff',
					fontSize: 40,
					font: 'roboto, sans-serif',
					decimalPlaces: 0
				},
				lines: {
					enabled: true,
					color: '#eee',
					style: 'straight'
				}
			},
			data: {
			  sortOrder: 'label-asc',

			   // (%11 Fumari Mandarin Zest) (%90 DarkSide Medium Kalee Grapefruit)
			  content: data || [
				{
					label: 'Kalee Grapefruit',
					sublabel: 'DarkSide Medium',
					value: 25,
					color: 'rgba(128, 204, 203, 0.69)'
				},
				{
					label: 'Mandarin Zest',
					sublabel: 'Fumari',
					value: 25,
					color: 'rgba(202, 106, 106, 0.69)'
				},
				{
					label: 'Limonchello',
					sublabel: 'Fumari',
					value: 25,
					color: 'rgba(179, 204, 128, 0.69)'
				},
				{
					label: 'Peach',
					sublabel: 'Fumari',
					value: 25,
					color: 'rgba(204, 128, 185, 0.69)'
				}
			  ]
			},
			misc: {
				colors: {
					segmentStroke: 'rgba(0, 0, 0, 0.51)'
				},
				cssPrefix: 'pie-',
				pieCenterOffset: {
					x: -50
				}
			}
		  });
	}
}
