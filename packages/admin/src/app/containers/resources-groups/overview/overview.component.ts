import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of, combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ResourcesGroupsRestService, ResourceGroupDto } from '@rest/resources-groups';
import { ResourcesRestService, ResourceDto } from '@rest/resources';

import { ConfirmComponent } from '@components/confirm/confirm.component';
import { UpsertComponent } from './upsert/upsert.component';

@Component({
	templateUrl: './overview.html',
	providers: [
		ResourcesGroupsRestService,
		ResourcesRestService
	]
})

export class OverviewComponent implements OnDestroy {
	private sub: Subscription;

	openned = '';
	loading = false;

	resources: ResourceDto[] = [];
	items: ResourceGroupDto[] = [];

	constructor(
		private modalService: NgbModal,
		private restService: ResourcesGroupsRestService,
		private resourcesRestService: ResourcesRestService,
		route: ActivatedRoute
	) {
		this.sub = route.queryParams.subscribe(p => {
			this.openned = p.openned;
		});

		this.fetchAll();
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	performCreate() {
		const modalRef = this.modalService.open(UpsertComponent);
		modalRef.componentInstance.submitted.subscribe(d => {
			this.create(d)
				.subscribe(
					() => {
						modalRef.componentInstance.setSaving(false);
						this.fetchAll();
					},
					() => modalRef.componentInstance.setSaving(false)
				);
		});
	}

	performUpdate(item: ResourceGroupDto) {
		const modalRef = this.modalService.open(UpsertComponent);
		modalRef.componentInstance.item = item;
		modalRef.componentInstance.submitted.subscribe(d => {
			this.update(d)
				.subscribe(
					() => {
						modalRef.componentInstance.setSaving(false);
						this.fetchAll();
					},
					() => modalRef.componentInstance.setSaving(false)
				);
		});
	}

	performRemove(item: ResourceGroupDto) {
		const modalRef = this.modalService.open(ConfirmComponent, {
			size: 'sm'
		});

		modalRef.componentInstance.result.subscribe(status => {
			if (!status) {
				return;
			}
			this.remove(item)
				.subscribe(
					() => {
						this.fetchAll();
					}
				);
		});
	}

	getResources(ids: string[]) {
		return this.resources.filter(r => {
			return ids.includes(r._id);
		});
	}

	private fetchAll() {
		this.loading = true;
		combineLatest(this.fetch(), this.fetchResources())
			.subscribe(
				() => {
					this.loading = false;
				},
				() => this.loading = false
			);
	}

	private fetchResources() {
		return this.resourcesRestService.list()
			.pipe(
				tap(d => {
					this.resources = d;
				})
			);
	}

	private fetch() {
		return this.restService.list()
			.pipe(
				tap(d => {
					this.items = d.sort((a, b) => {
						return +(b.created || '0') - +(a.created || '0');
					});
				})
			);
	}

	private create(d: ResourceGroupDto) {
		return this.restService.create(d);
	}

	private update(d: ResourceGroupDto) {
		return this.restService.update(d._id, d);
	}

	private remove(d: ResourceGroupDto) {
		return this.restService.remove(d._id);
	}
}
