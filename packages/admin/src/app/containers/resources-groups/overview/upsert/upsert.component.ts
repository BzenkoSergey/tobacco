import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { ResourcesGroupsRestService, ResourceGroupDto } from '@rest/resources-groups';
import { ResourcesRestService, ResourceDto } from '@rest/resources';

@Component({
	templateUrl: './upsert.html',
	providers: [
		ResourcesRestService
	]
})
export class UpsertComponent {
	@Output() submitted = new EventEmitter<ResourceGroupDto>();
	@Input() item = new ResourceGroupDto();

	selectedResource: ResourceDto;
	resources: ResourceDto[] = [];
	saving = false;

	formatter = (x: {name: string}) => x.name;
	search = (text$: Observable<string>) => {
		return text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map(term => {
				return term.length < 2 ? [] : this.resources
					.filter(v => {
						return !this.item.resources.includes(v._id);
					})
					.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
			})
		);
	}

	constructor(
		public activeModal: NgbActiveModal,
		private resourcesRestService: ResourcesRestService
	) {
		this.fetchResources();
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

	remove(resource: ResourceDto) {
		this.item.resources = this.item.resources.filter(r => r !== resource._id);
	}

	addResource() {
		if (!this.selectedResource) {
			return;
		}
		const id = this.selectedResource._id;
		if (this.item.resources.includes(id)) {
			return;
		}
		this.item.resources.push(id);
	}

	getResources(ids: string[]) {
		return this.resources.filter(r => {
			return ids.includes(r._id);
		});
	}

	private fetchResources() {
		this.resourcesRestService.list()
			.subscribe(d => this.resources = d);
	}
}
