import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SitemapDto } from '@rest/sitemap';

@Component({
	templateUrl: './upsert.html'
})
export class UpsertComponent {
	@Output() submitted = new EventEmitter<SitemapDto>();
	@Input() item = new SitemapDto();
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
