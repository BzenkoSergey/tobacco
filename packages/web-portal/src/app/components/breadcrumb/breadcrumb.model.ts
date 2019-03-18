export class BreadcrumbModel {
	title: string;
	url: string[];
	icon?: string;
	code: string;
	last?: boolean;

	constructor(d: BreadcrumbModel) {
		this.title = d.title;
		this.url = d.url;
		this.icon = d.icon;
		this.code = d.code;
		this.last = d.last;
	}
}
