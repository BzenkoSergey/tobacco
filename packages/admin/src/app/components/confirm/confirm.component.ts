import { Component, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	templateUrl: './confirm.html'
})
export class ConfirmComponent {
	@Output() result = new EventEmitter<boolean>();

	constructor(public activeModal: NgbActiveModal) {}

	no() {
		this.result.emit(false);
		this.activeModal.close();
	}

	yes() {
		this.result.emit(true);
		this.activeModal.close();
	}
}
