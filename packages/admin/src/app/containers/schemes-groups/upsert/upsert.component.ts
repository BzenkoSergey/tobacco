import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { SchemeGroupsRestService, SchemeGroupDto } from '@rest/scheme-groups';
import { SchemesRestService } from '@rest/schemes';

@Component({
	templateUrl: './upsert.html',
	providers: [
		SchemesRestService
	]
})
export class UpsertComponent {
	@Output() submitted = new EventEmitter<SchemeGroupDto>();
	@Input() item = new SchemeGroupDto();

	selectedScheme: any;
	schemes: any[] = [];
	saving = false;

	formatter = (x: {label: string}) => x.label;
	search = (text$: Observable<string>) => {
		return text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map(term => {
				return term.length < 2 ? [] : this.schemes
					.filter(v => {
						return !this.item.schemes.includes(v._id);
					})
					.filter(v => {
						return (v.label || '').toLowerCase().indexOf(term.toLowerCase()) > -1;
					})
					.slice(0, 30);
			})
		);
	}

	constructor(
		public activeModal: NgbActiveModal,
		private schemesService: SchemesRestService
	) {
		this.fetchSchemes();
	}

	setSaving(status: boolean) {
		this.saving = status;
		this.activeModal.close();
	}

	save(invalid: boolean) {
		if (invalid) {
			return;
		}
		this.saving = true;
		if (!this.item._id) {
			this.item.created = Date.now().toString();
		}
		this.submitted.emit(this.item);
	}

	remove(scheme: any) {
		this.item.schemes = this.item.schemes.filter(r => r !== scheme._id);
	}

	addScheme() {
		if (!this.selectedScheme) {
			return;
		}
		const id = this.selectedScheme._id;
		if (this.item.schemes.includes(id)) {
			return;
		}
		this.item.schemes.push(id);
	}

	getSchemes(ids: string[]) {
		return this.schemes.filter(r => {
			return ids.includes(r._id);
		});
	}

	private fetchSchemes() {
		this.schemesService.list()
			.subscribe(d => this.schemes = d);
	}
}
