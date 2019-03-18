export enum ReviewType {
	UNIT = 'UNIT',
	UNIT_MIX = 'UNIT_MIX'
}

export class ReviewDto {
	_id: string;
	text: string;
	datePublished: string;
	author: string;
	rating: number;

	constructor(d?: ReviewDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.text = d.text;
		this.datePublished = d.datePublished;
		this.author = d.author;
		this.rating = d.rating;
	}
}
