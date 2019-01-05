import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
	templateUrl: './run-input.html'
})
export class RunInputComponent {
	@Output() submitted = new EventEmitter<string>();
	input: string;
	json = false;

	constructor(public activeModal: NgbActiveModal) {}

	run() {
		if (this.json) {
			this.submitted.emit(JSON.parse(this.input));
		} else {
			this.submitted.emit(this.input);
		}
		this.activeModal.close();
	}
}
