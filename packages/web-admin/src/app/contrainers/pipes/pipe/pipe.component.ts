import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subject } from 'rxjs';

import { PipesRestService } from '@rest/pipes';

@Component({
	selector: 'pipe',
	templateUrl: './pipe.html',
	styleUrls: ['./pipe.scss'],
	providers: [PipesRestService]
})

export class PipeComponent implements OnInit, OnChanges {
	@Output() selected = new EventEmitter();
	@Input() pipe: any;


	ngOnChanges() {

		// console.log(this.pipes);
	}

	ngOnInit() {
	}

	select() {
		this.selected.emit(this.pipe);
	}

	selectChild(e) {
		this.selected.emit(e);
	}
}
