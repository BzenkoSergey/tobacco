import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of, combineLatest } from 'rxjs';
import { tap, mergeMap, filter, map } from 'rxjs/operators';

import { SchemeGroupsRestService, SchemeGroupDto } from '@rest/scheme-groups';
import { SchemesRestService } from '@rest/schemes';
import { SchemeProcessesRestService } from '@rest/scheme-processes';
import { SchemeProcessesDataRestService } from '@rest/scheme-processes-data';

import { ConfirmComponent } from '@components/confirm/confirm.component';
import { UpsertComponent } from './upsert/upsert.component';

@Component({
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [
		SchemeGroupsRestService,
		SchemesRestService,
		SchemeProcessesRestService,
		SchemeProcessesDataRestService
	]
})

export class OverviewComponent implements OnDestroy {
	private sub: Subscription;
	private groupedIds: string[] = [];

	saving = false;
	groups: SchemeGroupDto[] = [];
	items: any[] = [];

	openned = '';

	constructor(
		private modalService: NgbModal,
		private service: SchemesRestService,
		private groupsService: SchemeGroupsRestService,
		private schemeProcessesService: SchemeProcessesRestService,
		private schemeProcessesDataService: SchemeProcessesDataRestService,
		private router: Router,
		route: ActivatedRoute
	) {
		this.sub = route.queryParams.subscribe(p => {
			this.openned = p.openned;
		});
		this.fetch();
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	getSchemes(group: SchemeGroupDto) {
		return group.schemes.map(s => {
			return this.items.find(i => i._id === s);
		});
	}

	getUngrouped() {
		return this.items.filter(i => {
			return !this.groupedIds.includes(i._id);
		});
	}

	create(group?: SchemeGroupDto) {
		const scheme = {
			options: null,
			type: 'LINE',
			label: 'Placeholder',
			children: []
		};
		this.service.create(scheme)
			.subscribe(schemeId => {
				if (group) {
					group.schemes.unshift(schemeId.toString());
					this.groupsService.update(group._id, group)
						.subscribe(() => {
							this.fetch();
						});
				} else {
					this.fetch();
				}
			});
	}

	// remove(scheme: any) {
	// 	const group = this.groups.find(g => {
	// 		return g.schemes.includes(scheme._id);
	// 	});
	// 	this.schemeProcessesService
	// 		.removeAll({
	// 			entityId: scheme.id
	// 		})
	// 		.pipe(

	// 		);
	// }

	private fetch() {
		combineLatest(
			this.service.list(),
			this.groupsService.list()
		)
		.subscribe(
			d => {
				this.items = d[0];
				this.groups = d[1];

				this.groups.forEach(g => {
					this.groupedIds = this.groupedIds.concat(g.schemes);
				});
			}
		);
	}
}
