import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subject } from 'rxjs';

import { PipesRestService } from '@rest/pipes';

@Component({
	selector: 'group',
	templateUrl: './group.html',
	styleUrls: ['./group.scss'],
	providers: [PipesRestService]
})

export class GroupComponent implements OnInit, OnChanges {
	@Output() selected = new EventEmitter();
	@Output() selectedPipe = new EventEmitter();
	@Input() groupInfo: any;
	@Input() pipes: any[] = [];
	@Input() groups: any[] = [];
	@Input() processId: number;
	@Input() order: number;
	group: any;

	constructor(

	) {}

	ngOnChanges() {
		if (this.groupInfo) {
			this.group = this.getPipeGroup(this.groupInfo.id);
		}
		// console.log(this.pipes);
	}

	ngOnInit() {
	}

	selectPipe(e) {
		const a = {
			...e,
			groupInfo: this.groupInfo,
			group: this.group
		};
		this.selectedPipe.emit(a);
	}

	select() {
		// console.log(this.groupInfo, this.group);
		this.selected.emit({
			groupInfo: this.groupInfo,
			group: this.group
		});
	}

	selectChild(e) {
		this.selected.emit(e);
	}

	getPipeGroup(groupId: string) {
		const group = this.groups.find(p => {
			return p._id === groupId;
		});
		if (this.processId && this.order) {
			const info = group.processes.find(p => {
				return p.parentProcess === this.processId && p.order === this.order;
			});
			if (!info) {
				console.log(this.processId, this.order, group.processes);
				// debugger;
			}
			return info;
		}
		return group;
	}
}
