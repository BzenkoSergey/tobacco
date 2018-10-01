export class DocumentDto {
	_id?: {
		$oid: string
	} | string;

	constructor(d?: DocumentDto) {
		if (!d) {
			return;
		}
		this._id = d._id;
	}
}