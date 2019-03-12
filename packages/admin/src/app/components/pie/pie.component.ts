import { Component, ViewChild, Input, Output, OnInit, EventEmitter, OnDestroy, OnChanges, AfterContentInit } from '@angular/core';
import { Subscription, Subject, ReplaySubject } from 'rxjs';


import * as html2canvas from 'html2canvas';

// import { FlowTreeService } from './flow-tree.service';
import { PieService } from './pie.service';

@Component({
	selector: 'pie',
	templateUrl: './pie.html',
	providers: [PieService]
})

export class PieComponent implements OnChanges, AfterContentInit, OnInit, OnDestroy {
	@ViewChild('view') view: any;
	@Output() selected = new EventEmitter();
	@Output() selectedBranch = new EventEmitter();
	@Output() made = new EventEmitter();
	@Input() current: string;
	@Input() data: any;
	@Input() image = 'http://i.huffpost.com/gen/2930708/images/o-GMO-ORANGES-facebook.jpg';

	data2 = new Map();
	dd: string;
	private sub: Subscription;
	s = Date.now();
	inited = false;
	ddd: any;

	mainImage: string;
	secondImage: string;

	constructor(private service: PieService) {
		this.getUrl('https://res.cloudinary.com/dwkakr4wt/image/upload/v1551657382/brands/Untitled-1.jpg')
			.subscribe(d => this.secondImage = d);
	}

	ngOnInit() {
		console.log('INT');
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	ngOnChanges(c: any) {
		console.log(c);
		console.log(this.image);
		if (this.image) {
			this.getUrl(this.image)
			.subscribe(d => this.mainImage = d);
		} else {
			this.mainImage = '';
		}
		// if (this.current) {
		// 	this.service.setCurrent(this.current);
		// }
		if (c.data) {
			this.run(this.data);
		}
	}

	getUrl(url: string) {
		if (this.data2.get(url)) {
			return this.data2.get(url);
		}
		let d: any;
		if (this.isExternal(url)) {
			d = this.getDataUri('http://' + window.location.hostname + ':3330/scheme/code/IMG_EXTERNAL_DOWNLOAD/options?loadImage=true&path=' + url);
		} else {
			d = this.getDataUri('http://' + window.location.hostname + ':3330/scheme/code/IMG_DOWMLOAD/options?isFile=true&path=' + url);
		}
		this.data2.set(url, d);
		return d;
	}

	isExternal(url: string) {
		return url.includes('http');
	}

	createS() {
		this.svgToCanvas(document.querySelector('#asdasd'));

		const canvas2 = document.createElement('canvas');
		const w = 954;
		const h = 500;
		canvas2.width = w * 3;
		canvas2.height = h * 3;
		canvas2.style.width = w * 3 + 'px';
		canvas2.style.height = h * 3 + 'px';
		const context = canvas2.getContext('2d');
		context.scale(3, 3);

		html2canvas(document.querySelector('#asdasd'), {allowTaint: true, useCORS: false, canvas: canvas2}).then(canvas => {



			// const ctx = canvas.getContext('2d');

			// ctx.webkitImageSmoothingEnabled = false;
			// ctx.mozImageSmoothingEnabled = false;
			// ctx.imageSmoothingEnabled = false;

			// document.body.appendChild(canvas);
			this.dd = canvas.toDataURL('image/jpg');
			this.made.emit(this.dd);
		});
	}

	svgToCanvas(targetElem) {
		const svgElem = targetElem.getElementsByTagName('text');
		const svgElem2 = targetElem.getElementsByTagName('tspan');

        for (const node of svgElem) {
			console.log(node);
			let a = node.getAttribute('style') || '';
			a += 'font-family:' +  window.getComputedStyle(node, null).getPropertyValue('font-family') + ';';
			a += 'text-transform:' +  window.getComputedStyle(node, null).getPropertyValue('text-transform') + ';';
			a += 'font-size:' +  window.getComputedStyle(node, null).getPropertyValue('font-size') + ';';
			a += 'font-weight:' +  window.getComputedStyle(node, null).getPropertyValue('font-weight') + ';';
			a += 'dominant-baseline:' +  window.getComputedStyle(node, null).getPropertyValue('dominant-baseline') + ';';
			node.setAttribute('style', a);
          node.replaceWith(node);
        }
        for (const node of svgElem2) {
			console.log(node);
			let a = node.getAttribute('style') || '';
			a += 'font-family:' +  window.getComputedStyle(node, null).getPropertyValue('font-family') + ';';
			a += 'text-transform:' +  window.getComputedStyle(node, null).getPropertyValue('text-transform') + ';';
			a += 'font-size:' +  window.getComputedStyle(node, null).getPropertyValue('font-size') + ';';
			a += 'font-weight:' +  window.getComputedStyle(node, null).getPropertyValue('font-weight') + ';';
			node.setAttribute('style', a);
          node.replaceWith(node);
        }
    }
	updateCurrent(current: string) {
		this.current = current;
		// this.service.setCurrent(this.current);
	}

	updateData(data: any) {
		this.data = data;
		// this.service.runUpdate(this.data);
	}

	run(data: any) {
		this.data = data;
		this.inited = false;
		if (this.ddd) {
			clearTimeout(this.ddd);
			this.ddd = null;
		}
		this.ddd = setTimeout(() => {
			this.inited = true;
			this.service.render(data);
		}, 100);
	}

	ngAfterContentInit() {
		if (this.inited) {
			return;
		}

		// this.service.setCurrent(this.current);
		this.run(this.data);
	}

	private getDataUri(url: string) {
		const subj = new ReplaySubject(1);
		const xhr = new XMLHttpRequest();
		xhr.onload = function() {
			const reader = new FileReader();
			reader.onloadend = function() {
				subj.next(reader.result);
				subj.complete();
			};
			reader.readAsDataURL(xhr.response);
		};
		xhr.open('GET', url);
		xhr.responseType = 'blob';
		xhr.send();
		return subj;
	}
}
