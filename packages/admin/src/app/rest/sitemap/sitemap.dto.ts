export class SitemapDto {
	_id: string;
	loc: string;
	changefreq = 'weekly';
	priority = '0.7';
	lastmod: string;

	constructor(d?: SitemapDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.loc = d.loc;
		this.changefreq = d.changefreq;
		this.priority = d.priority;
		this.lastmod = d.lastmod;
	}
}
