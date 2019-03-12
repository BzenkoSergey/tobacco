import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of, combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SitemapRestService, SitemapDto } from '@rest/sitemap';

import { ConfirmComponent } from '@components/confirm/confirm.component';
import { UpsertComponent } from './upsert/upsert.component';

@Component({
	templateUrl: './sitemap.html',
	providers: [
		SitemapRestService
	]
})

export class SitemapComponent implements OnInit {
	items: SitemapDto[] = [];

	constructor(
		private modalService: NgbModal,
		private service: SitemapRestService
	) {}

	ngOnInit() {
		this.fetch();
	}

	create() {
		const modalRef = this.modalService.open(UpsertComponent, { size: 'lg' });
		modalRef.componentInstance.submitted.subscribe(l => {
			this.service.create(l)
				.subscribe(() => {
					modalRef.componentInstance.setSaving(false);
					this.fetch();
				});
		});
	}

	performEdit(dto: SitemapDto) {
		const modalRef = this.modalService.open(UpsertComponent, { size: 'lg' });
		modalRef.componentInstance.item = dto;
		modalRef.componentInstance.submitted.subscribe(l => {
			this.service.update(l._id, l)
				.subscribe(() => {
					modalRef.componentInstance.setSaving(false);
					this.fetch();
				});
		});
	}

	performRemove(dto: SitemapDto) {
		const modalRef = this.modalService.open(ConfirmComponent, {
			size: 'sm'
		});

		modalRef.componentInstance.result.subscribe(status => {
			if (!status) {
				return;
			}
			this.service.remove(dto._id)
				.subscribe(() => {
					this.fetch();
				});
		});
	}

	private fetch() {
		this.service.list()
			.subscribe(
				d => {
					this.items = d;
				}
			);
	}
}
