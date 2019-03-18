import { Injectable } from '@angular/core';

import { AnalyticsRestService } from '@rest/analytics';

@Injectable()
export class AnalyticsService {
	private storeCode = 'ANALYTICS_USER_ID';
	// private sessionCode = 'ANALYTICS_SESSION';
	private userId: string|null;
	// private session: string|null;

	constructor(private service: AnalyticsRestService) {
		this.userId = window.localStorage.getItem(this.storeCode) || this.genId();
		window.localStorage.setItem(this.storeCode, this.userId);

		// this.session = window.localStorage.getItem(this.sessionCode) || Date.now().toString();
		// window.localStorage.setItem(this.sessionCode, this.session);
	}

	changeUrl() {
		const info = this.userInfo();
		info.h_url = window.location.href;
		this.create(info);
	}

	private create(info: any) {
		this.service.create(info)
			.subscribe(() => {});
	}

	private userInfo(): any {
		const language = window.navigator.language;
		const userAgent = window.navigator.userAgent;
		const platform = window.navigator.platform;
		const referrer = document.referrer;
		const userId = this.userId;
		return {
			h_language: language,
			h_userAgent: userAgent,
			h_platform: platform,
			h_referrer: referrer,
			h_userId: userId
			// ,
			// h_session: this.session
		};
	}

	private genId() {
		return Date.now().toString() + (Math.random() * Math.random());
	}
}
