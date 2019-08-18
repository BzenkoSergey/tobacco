import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { ReplaySubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class IconService {
	private map = new Map<string, string>([
		['store', 'solid/store.svg'],
		['mortar-pestle', 'solid/mortar-pestle.svg'],
		['home', 'solid/home.svg'],
		['filter', 'solid/filter.svg'],
		['angle-double-down', 'solid/angle-double-down.svg'],
		['angle-right', 'solid/angle-right.svg'],
		['square', 'regular/square.svg'],
		['caret-down', 'solid/caret-down.svg'],
		['caret-up', 'solid/caret-up.svg'],
		['star', 'solid/star.svg'],
		['empty-star', 'regular/star.svg'],
		['check-square', 'regular/check-square.svg'],
		['chevron-down', 'solid/chevron-down.svg'],
		['chevron-up', 'solid/chevron-up.svg'],
		['chevron-right', 'solid/chevron-right.svg'],
		['comment', 'regular/comment.svg'],
		['info-circle', 'solid/info-circle.svg'],
		['spinner', 'solid/spinner.svg'],
		['leaf', 'solid/leaf.svg'],
		['cubes', 'solid/cubes.svg'],
		['ring', 'solid/ring.svg'],
		['long-arrow-alt-left', 'solid/long-arrow-alt-left.svg'],
		['sliders-h', 'solid/sliders-h.svg'],
		['times-circle', 'regular/times-circle.svg'],
		['redo', 'solid/redo.svg']
	]);

	private loadMap = new Map<string, ReplaySubject<string>>();

	constructor(
		private http: HttpClient,
		@Inject(DOCUMENT) private document: Document,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	fetch(icon: string) {
		const iconPath = this.map.get(icon);
		if (!iconPath) {
			return;
		}
		let subj = this.loadMap.get(iconPath);
		if (subj) {
			return subj;
		}
		subj = new ReplaySubject<string>(1);

		this.http.get(this.document.location.origin + '/assets/svg/' + iconPath, {responseType: 'text'})
			.subscribe(
				d => subj.next(d),
				e => {
					subj.error(e);
				},
				() => subj.complete()
			);
		this.loadMap.set(iconPath, subj);
		return subj;
	}
}
