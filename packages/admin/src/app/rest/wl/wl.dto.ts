import { WlDbDto } from './db.dto';

export class WlDto {
	_id: string;
	db = new WlDbDto();
	menu: any[] = [];

	constructor(d?: WlDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.db = new WlDbDto(d.db);
		this.menu = d.menu || [];
	}
}
