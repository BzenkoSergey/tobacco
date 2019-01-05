import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of, combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ResourcesRestService, ResourceDto } from '@rest/resources';

import { ConfirmComponent } from '@components/confirm/confirm.component';
import { UpsertComponent } from './upsert/upsert.component';

@Component({
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [
		ResourcesRestService
	]
})

export class OverviewComponent implements OnDestroy {
	private sub: Subscription;

	items: ResourceDto[] = [];
	loading = false;

	states = [
		{
			id: '1',
			openned: false
		},
		{
			id: '2',
			openned: false
		}
	];

	constructor(
		private modalService: NgbModal,
		private service: ResourcesRestService,
		route: ActivatedRoute
	) {
		this.fetch();
		this.sub = route.queryParams.subscribe(p => {
			const openned = p.openned;
			this.openItem(openned);
		});
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
						this.fetch();
					},
					() => modalRef.componentInstance.setSaving(false)
				);
		});
	}

	performUpdate(item: ResourceDto) {
		const modalRef = this.modalService.open(UpsertComponent);
		modalRef.componentInstance.item = item;
		modalRef.componentInstance.submitted.subscribe(d => {
			this.update(d)
				.subscribe(
					() => {
						modalRef.componentInstance.setSaving(false);
						this.fetch();
					},
					() => modalRef.componentInstance.setSaving(false)
				);
		});
	}

	performRemove(item: ResourceDto) {
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
						this.fetch();
					}
				);
		});
	}

	private openItem(id: string) {
		if (!id) {
			return;
		}
		this.states.forEach(s => {
			s.openned = s.id === id;
		});
	}

	private fetch() {
		this.loading = true;
		return this.service.list()
			.subscribe(
				d => {
					this.items = d.sort((a, b) => {
						return +(b.created || '0') - +(a.created || '0');
					});
					this.loading = false;
				},
				() => {
					this.loading = false;
				}
			);
	}

	private create(d: ResourceDto) {
		return this.service.create(d);
	}

	private update(d: ResourceDto) {
		return this.service.update(d._id, d);
	}

	private remove(d: ResourceDto) {
		return this.service.remove(d._id);
	}
}
