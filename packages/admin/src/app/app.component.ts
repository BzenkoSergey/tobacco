import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';

import { filter } from 'rxjs/operators';

import { NotificationDto, NotificationRestService } from '@rest/notifications';

@Component({
	selector: 'app-root',
	templateUrl: './app.html',
	styleUrls: ['./app.scss'],
	providers: [
		NotificationRestService
	]
})
export class AppComponent {
	title = 'admin';
	closed = true;
	showNotifications = false;

	navs = [
		{
			name: 'Main',
			children: [
				{
					name: 'Resources',
					url: '',
					icon: 'fa-fax',
					children: [
						{
							name: 'Overview',
							url: '/resources'
						},
						{
							name: 'Groups',
							url: '/resources-groups'
						},
						{
							name: 'Items',
							url: '/resources-items'
						}
					]
				},
				{
					name: 'Units',
					url: '',
					icon: 'fa-fax',
					children: [
						{
							name: 'Overview',
							url: 'units'
						},
						{
							name: 'Lines',
							url: 'unit-lines'
						},
						{
							name: 'Attributes',
							url: 'unit-attributes'
						},
						{
							name: 'Categories',
							url: 'categories'
						},
						{
							name: 'Companies',
							url: 'companies'
						},
						{
							name: 'Items',
							url: 'unit-items'
						},
						{
							name: 'Mixes',
							url: 'unit-mixes'
						}
					]
				},
				{
					name: 'Wiki',
					url: '',
					icon: 'fa-fax',
					children: [
						{
							name: 'Overview',
							url: 'wiki'
						}
					]
				}
			]
		},
		{
			name: 'System',
			children: [
				{
					name: 'Schemes',
					url: '',
					icon: 'fa-fax',
					children: [
						{
							name: 'Overview',
							url: 'schemes'
						},
						{
							name: 'Groups',
							url: 'schemes-groups'
						}
					]
				},
				{
					name: 'Images',
					url: '',
					icon: 'fa-fax',
					children: [
						{
							name: 'Overview',
							url: 'images'
						}
					]
				},
				{
					name: 'WL',
					url: '',
					icon: 'fa-fax',
					children: [
						{
							name: 'Menu',
							url: 'wl/menu'
						},
						{
							name: 'Data Base',
							url: 'wl/db'
						},
						{
							name: 'Tools',
							url: 'wl/tools'
						}
					]
				},
				{
					name: 'Seo',
					url: '',
					icon: 'fa-fax',
					children: [
						{
							name: 'Positions',
							url: 'seo/positions'
						},
						{
							name: 'Sitemap',
							url: 'seo/sitemap'
						}
					]
				}
			]
		}
	];
	breadcrumb: any[] = [];
	notifications: NotificationDto[] = [];

	constructor(
		private notificationRestService: NotificationRestService,
		private router: Router,
		private activeRoute: ActivatedRoute
	) {
		this.fetchNotifications();
		this.router.events
			.pipe(
				filter(event => event instanceof NavigationEnd)
			)
			.subscribe((routeChange) => {
				let path = '';
				this.breadcrumb = this.generateRouteParts(this.activeRoute.snapshot)
					.filter(f => !!f)
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

	setRead(n: NotificationDto) {
		if (n.read) {
			return;
		}
		n.read = true;
		n.readDate = Date.now().toString();
		this.notificationRestService.update(n._id, n)
			.subscribe(d => {

			});
	}

	generateRouteParts(snapshot: ActivatedRouteSnapshot): any[]|null {
		let routeParts = <any[]>[];
		if (snapshot) {
		  if (snapshot.firstChild) {
			routeParts = routeParts.concat(this.generateRouteParts(snapshot.firstChild));
		  }
		  if (snapshot.url.length) {
			// console.log(snapshot.url);
			// debugger;
			const routeConfig = snapshot.routeConfig;
			if (!routeConfig.data || !routeConfig.data['breadcrumb']) {
				return routeParts;
			}

			routeParts.push({
			  title: snapshot.data['title'],
			  breadcrumb: routeConfig.data['breadcrumb'],
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

	getNotificationsCount() {
		return this.notifications.filter(n => !n.read).length;
	}

	private fetchNotifications() {
		this.notificationRestService
			.list({
				read: {
					$ne: true
				}
			})
			.subscribe(
				d => this.notifications = d
			);
	}
}
