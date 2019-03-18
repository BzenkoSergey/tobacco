import { Injectable, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class LinkService implements OnDestroy {
	private routeListener: Subscription;

	constructor(
		@Inject(DOCUMENT) private readonly document: Document,
		private readonly router: Router,
	) {}

	ngOnDestroy(): void {
		this.routeListener.unsubscribe();
	}

	/**
	 * Start listening on NavigationEnd router events
	 */
	public startRouteListener(): void {
		this.routeListener = this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe(
			() => {
				let url = '';
				const urlTree = this.router.parseUrl(this.router.url);

				if (urlTree.root.hasChildren()) {

					const segments = urlTree.root.children['primary'].segments;

					if (segments && segments.length > 0) {
						url = segments.map(segment => segment.path).join('/');
					}
				}

				this.updateTag({
					rel: 'canonical',
					href: `/${url}`
				});
			}
		);
	}

	public updateTag(tag: LinkDefinition): void {
		const selector = this._parseSelector(tag);
		const linkElement = <HTMLLinkElement> this.document.head.querySelector(selector)
			|| this.document.head.appendChild(this.document.createElement('link'));

		if (linkElement) {
			Object.keys(tag).forEach((prop: string) => {
				linkElement[prop] = tag[prop];
			});
		}
	}

	public removeTag(tag: LinkDefinition): void {
		const selector = this._parseSelector(tag);
		const linkElement = <HTMLLinkElement> this.document.head.querySelector(selector);

		if (linkElement) {
			this.document.head.removeChild(linkElement);
		}
	}

	public getTag(tag: LinkDefinition): HTMLLinkElement {
		const selector = this._parseSelector(tag);

		return this.document.head.querySelector(selector);
	}

	public getTags(): NodeListOf<HTMLLinkElement> {
		return this.document.head.querySelectorAll('link');
	}

	private _parseSelector(tag: LinkDefinition): string {
		const attr: string = tag.rel ? 'rel' : 'hreflang';
		return `link[${attr}="${tag[attr]}"]`;
	}
}

export declare type LinkDefinition = {
	charset?: string;
	crossorigin?: string;
	href?: string;
	hreflang?: string;
	media?: string;
	rel?: string;
	rev?: string;
	sizes?: string;
	target?: string;
	type?: string;
} & {
	[prop: string]: string;
};
