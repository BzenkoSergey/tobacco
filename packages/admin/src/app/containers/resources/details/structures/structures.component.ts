import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ResourcesRestService, ResourceDto, ResourceStructureDto } from '@rest/resources';

import { ConfirmComponent } from '@components/confirm/confirm.component';
import { UpsertComponent } from './upsert/upsert.component';

@Component({
	templateUrl: './structures.html',
	providers: [
		ResourcesRestService
	]
})

export class StructuresComponent implements OnDestroy {
	private sub: Subscription;
	private itemId: string;

	saving = false;
	item = new ResourceDto();

	constructor(
		private modalService: NgbModal,
		private service: ResourcesRestService,
		route: ActivatedRoute
	) {
		this.sub = route.params.subscribe(params => {
			this.itemId = params.resourceId;
			this.fetch();
		});
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	create() {
		const modalRef = this.modalService.open(UpsertComponent, { size: 'lg' });
		modalRef.componentInstance.submitted.subscribe(l => {
			this.item.structures.unshift(this.handleStructure(l));
			this.save()
				.subscribe(
					() => {
						modalRef.componentInstance.setSaving(false);
					},
					() => modalRef.componentInstance.setSaving(false)
				);
		});
	}

	performEdit(structure: ResourceStructureDto) {
		const modalRef = this.modalService.open(UpsertComponent, { size: 'lg' });
		const index = this.item.structures.indexOf(structure);
		modalRef.componentInstance.item = structure;
		modalRef.componentInstance.submitted.subscribe(l => {
			this.item.structures[index] = this.handleStructure(l);
			this.save()
				.subscribe(
					() => {
						modalRef.componentInstance.setSaving(false);
					},
					() => modalRef.componentInstance.setSaving(false)
				);
		});
	}

	performRemove(structure: ResourceStructureDto) {
		const modalRef = this.modalService.open(ConfirmComponent, {
			size: 'sm'
		});

		modalRef.componentInstance.result.subscribe(status => {
			if (!status) {
				return;
			}
			this.item.structures = this.item.structures.filter(i => {
				return i !== structure;
			});

			this.save().subscribe();
		});
	}

	private handleStructure(structure: ResourceStructureDto) {
		const s = JSON.parse(structure.structure);
		if (Array.isArray(s)) {
			s.forEach(i => {
				i.resource = this.itemId;
				i.structureCode = structure.code;
			});
		} else {
			s.resource = this.itemId;
			s.structureCode = structure.code;
		}
		structure.structure = JSON.stringify(s, null, '    ');
		return structure;
	}

	private save() {
		this.saving = true;
		return this.service.update(this.itemId, this.item)
			.pipe(
				tap(() => {
					this.saving = false;
				})
			);
	}

	private fetch() {
		this.service.get(this.itemId)
			.subscribe(
				d => {
					this.item = d;
				}
			);
	}
}
