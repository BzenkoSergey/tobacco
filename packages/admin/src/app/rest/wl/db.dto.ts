export class WlDbDto {
	_id: string;
	ip: string;
	port: string;
	db: string;

	constructor(d?: WlDbDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.ip = d.ip;
		this.port = d.port;
		this.db = d.db;
	}
}
