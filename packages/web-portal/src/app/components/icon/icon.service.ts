import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
		['comment', 'regular/comment.svg'],
		['info-circle', 'solid/info-circle.svg'],
		['spinner', 'solid/spinner.svg'],
		['leaf', 'solid/leaf.svg'],
		['cubes', 'solid/cubes.svg'],
		['ring', 'solid/ring.svg']
	]);

	private loadMap = new Map<string, ReplaySubject<string>>();

	constructor(private http: HttpClient) {}

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
		this.http.get(window.location.origin + '/assets/svg/' + iconPath, {responseType: 'text'})
			.subscribe(
				d => subj.next(d),
				e => subj.error(e),
				() => subj.complete()
			);
		this.loadMap.set(iconPath, subj);
		return subj;
	}
}
