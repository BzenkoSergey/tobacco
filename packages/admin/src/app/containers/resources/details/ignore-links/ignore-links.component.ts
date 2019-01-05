import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ResourcesRestService, ResourceDto } from '@rest/resources';

import { ConfirmComponent } from '@components/confirm/confirm.component';
import { UpsertComponent } from './upsert/upsert.component';

@Component({
	templateUrl: './ignore-links.html',
	providers: [
		ResourcesRestService
	]
})

export class IgnoreLinksComponent implements OnDestroy {
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
		const modalRef = this.modalService.open(UpsertComponent);
		modalRef.componentInstance.submitted.subscribe(l => {
			this.item.ignoreLinks.unshift(l);
			this.save()
				.subscribe(
					() => {
						modalRef.componentInstance.setSaving(false);
					},
					() => modalRef.componentInstance.setSaving(false)
				);
		});
	}

	performEdit(link) {
		const modalRef = this.modalService.open(UpsertComponent);
		const index = this.item.ignoreLinks.indexOf(link);
		modalRef.componentInstance.item = link;
		modalRef.componentInstance.submitted.subscribe(l => {
			this.item.ignoreLinks[index] = l;
			this.save()
				.subscribe(
					() => {
						modalRef.componentInstance.setSaving(false);
					},
					() => modalRef.componentInstance.setSaving(false)
				);
		});
	}

	performRemove(link: string) {
		const modalRef = this.modalService.open(ConfirmComponent, {
			size: 'sm'
		});

		modalRef.componentInstance.result.subscribe(status => {
			if (!status) {
				return;
			}
			this.item.ignoreLinks = this.item.ignoreLinks.filter(i => {
				return i !== link;
			});

			this.save().subscribe();
		});
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
