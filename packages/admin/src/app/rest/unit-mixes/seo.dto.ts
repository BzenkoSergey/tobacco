export class UnitSeoDto {
	title: string;
	description: string;
	keywords: string;

	constructor(d?: UnitSeoDto) {
		if (!d) {
			return;
		}
		this.title = d.title;
		this.description = d.description;
		this.keywords = d.keywords;
	}
}
