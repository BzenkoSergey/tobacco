import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of, combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SchemeGroupsRestService, SchemeGroupDto } from '@rest/scheme-groups';
import { SchemesRestService } from '@rest/schemes';

import { ConfirmComponent } from '@components/confirm/confirm.component';
import { UpsertComponent } from './upsert/upsert.component';

@Component({
	templateUrl: './schemes-groups.html',
	providers: [
		SchemeGroupsRestService,
		SchemesRestService
	]
})

export class SchemesGroupsComponent implements OnDestroy {
	private sub: Subscription;

	openned = '';
	loading = false;

	schemes: any[] = [];
	items: SchemeGroupDto[] = [];

	constructor(
		private modalService: NgbModal,
		private service: SchemeGroupsRestService,
		private schemesService: SchemesRestService,
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

	performUpdate(item: SchemeGroupDto) {
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

	performRemove(item: SchemeGroupDto) {
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

	getSchemes(ids: string[]) {
		return this.schemes.filter(r => {
			return ids.includes(r._id);
		});
	}

	private fetchAll() {
		this.loading = true;
		combineLatest(this.fetch(), this.fetchSchemes())
			.subscribe(
				() => {
					this.loading = false;
				},
				() => this.loading = false
			);
	}

	private fetchSchemes() {
		return this.schemesService.list()
			.pipe(
				tap(d => {
					this.schemes = d;
				})
			);
	}

	private fetch() {
		return this.service.list()
			.pipe(
				tap(d => {
					this.items = d.sort((a, b) => {
						return +(b.created || '0') - +(a.created || '0');
					});
				})
			);
	}

	private create(d: SchemeGroupDto) {
		return this.service.create(d);
	}

	private update(d: SchemeGroupDto) {
		return this.service.update(d._id, d);
	}

	private remove(d: SchemeGroupDto) {
		return this.service.remove(d._id);
	}
}
