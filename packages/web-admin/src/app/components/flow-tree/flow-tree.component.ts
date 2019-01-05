import { Component, ViewChild, Input, Output, OnInit, EventEmitter, OnDestroy, OnChanges, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs';

// import { FlowTreeService } from './flow-tree.service';
import { FlowTreeService } from './flow-tree.service';

@Component({
	selector: 'flow-tree',
	templateUrl: './flow-tree.html',
	styleUrls: ['./flow-tree.scss'],
	providers: [FlowTreeService]
})

export class FlowTreeComponent implements OnChanges, AfterContentInit, OnInit, OnDestroy {
	@ViewChild('view') view: any;
	@Output() selected = new EventEmitter();
	@Output() selectedBranch = new EventEmitter();
	@Input() current: string;
	@Input() data: any;

	private sub: Subscription;
	s = Date.now();
	inited = false;

	constructor(private service: FlowTreeService) {
		this.sub = service.selected.subscribe(d => {
			this.selected.emit(d);
		});
		this.sub = service.selectedBranch.subscribe(d => {
			this.selectedBranch.emit(d);
		});
	}

	ngOnInit() {
		console.log('INT');
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	ngOnChanges() {
		if (!this.inited) {
			return;
		}
		if (this.current) {
			this.service.setCurrent(this.current);
		}
		if (this.data) {
			this.service.runUpdate(this.data);
		}
	}

	updateCurrent(current: string) {
		this.current = current;
		this.service.setCurrent(this.current);
	}

	updateData(data: any) {
		this.data = data;
		this.service.runUpdate(this.data);
	}

	run(data: any) {
		this.data = data;
		this.service.run2(data, this.view.nativeElement);
	}

	ngAfterContentInit() {
		if (this.inited) {
			return;
		}

		this.inited = true;
		this.service.setCurrent(this.current);
		this.service.run2(this.data, this.view.nativeElement);
	}
}
