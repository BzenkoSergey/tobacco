import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';

import { filter } from 'rxjs/operators';

@Component({
	selector: 'root',
	templateUrl: './root.html',
	styleUrls: ['./root.scss']
})
export class RootComponent {
	opennedSideBar = false;
	title = 'web-admin';
	breadcrumb: any[] = [];

	constructor(
		private router: Router,
		private activeRoute: ActivatedRoute
	) {
		this.router.events
			.pipe(
				filter(event => event instanceof NavigationEnd)
			)
			.subscribe((routeChange) => {
				let path = '';
				this.breadcrumb = this.generateRouteParts(this.activeRoute.snapshot)
					.reverse()
					.map(b => {
						path = path + '/' + b.url;
						b.url = path;
						console.log(path);
						return b;
					});
				console.log(this.breadcrumb);
			});
	}

	generateRouteParts(snapshot: ActivatedRouteSnapshot): any[] {
		let routeParts = <any[]>[];
		if (snapshot) {
		  if (snapshot.firstChild) {
			routeParts = routeParts.concat(this.generateRouteParts(snapshot.firstChild));
		  }
		  if (snapshot.url.length) {
			// console.log(snapshot.url);
			routeParts.push({
			  title: snapshot.data['title'],
			  breadcrumb: snapshot.data['breadcrumb'],
			  url: snapshot.url.map(u => u.path).join('/'),
			  urlSegments: snapshot.url,
			  params: snapshot.params
			});
		  } else {
			//   console.log(snapshot);
		  }
		}
		return routeParts;
	  }
}
