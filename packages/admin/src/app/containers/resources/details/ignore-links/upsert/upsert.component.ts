import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	templateUrl: './upsert.html'
})
export class UpsertComponent {
	@Output() submitted = new EventEmitter<string>();
	@Input() item = '';
	saving = false;

	constructor(public activeModal: NgbActiveModal) {}

	setSaving(status: boolean) {
		this.saving = status;
		this.activeModal.close();
	}

	save(invalid: boolean) {
		if (invalid) {
			return;
		}
		this.saving = true;
		this.submitted.emit(this.item);
	}
}
