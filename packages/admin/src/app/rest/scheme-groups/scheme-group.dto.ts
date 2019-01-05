export class SchemeGroupDto {
	_id: string;
	name: string;
	code: string;
	schemes: string[] = [];
	created: string;

	constructor(d?: SchemeGroupDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
		this.name = d.name;
		this.code = d.code;
		this.schemes = d.schemes;
		this.created = d.created;
	}
}
