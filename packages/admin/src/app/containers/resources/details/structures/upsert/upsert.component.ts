import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ResourceStructureDto } from '@rest/resources';

@Component({
	templateUrl: './upsert.html'
})
export class UpsertComponent {
	@Output() submitted = new EventEmitter<ResourceStructureDto>();
	@Input() item = new ResourceStructureDto();
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
