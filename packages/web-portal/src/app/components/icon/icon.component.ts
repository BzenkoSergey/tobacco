import { Component, Input, OnChanges, SimpleChanges, ElementRef, ChangeDetectionStrategy } from '@angular/core';

import { IconService } from './icon.service';

@Component({
	selector: 'icon',
	templateUrl: './icon.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class IconComponent implements OnChanges {
	@Input() icon: string;
	@Input() width: number;
	@Input() height: number;

	constructor(
		private service: IconService,
		private el: ElementRef
	) {
		el.nativeElement.style.display = 'inline-block';
	}

	ngOnChanges(change: SimpleChanges) {
		if (change.icon && this.icon) {
			this.fetch();
		}
		if (change.width && this.width) {
			this.setWith();
		}
		if (change.height && this.height) {
			this.setHeight();
		}
	}

	private setWith() {
		this.el.nativeElement.style.width = this.width ? this.width + 'px' : 'auto';
	}
	private setHeight() {
		this.el.nativeElement.style.height = this.height ? this.height + 'px' : 'auto';
	}

	private fetch() {
		this.service.fetch(this.icon)
			.subscribe(d => {
				this.el.nativeElement.innerHTML = d;
			});
	}
}
